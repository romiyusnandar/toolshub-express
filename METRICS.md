# API Metrics System Documentation

## Overview
Sistem metrics yang persistent untuk melacak penggunaan API **TOOLS SAJA** (/api/tools) dan menyimpan data ke MongoDB sehingga tidak hilang saat deployment ulang di Vercel.

## Features
- ✅ **Tools Only Tracking**: Hanya menghitung hits ke endpoint /api/tools
- ✅ **Persistent Storage**: Data disimpan di MongoDB, tidak hilang saat redeploy
- ✅ **Daily Aggregation**: Tracking harian dengan tanggal
- ✅ **Background Saving**: Non-blocking database operations
- ✅ **Real-time + Historical**: Instance metrics + total database metrics
- ✅ **Lightweight**: Tidak tracking auth, dashboard, health, atau file statis

## Endpoints

### 1. Health Endpoint (Enhanced)
```
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": "2m 30s",
  "memory": {
    "used": 45.2,
    "total": 512
  },
  "traffic": {
    "allTime": {
      "total": 800,
      "tools": 800,
      "apiHits": 800
    },
    "today": {
      "total": 30,
      "tools": 30,
      "apiHits": 30
    },
    "currentInstance": {
      "total": 8,
      "apiHits": 8
    },
    "note": "Only tracking /api/tools endpoints"
  }
}
```

### 2. Metrics Summary
```
GET /api/metrics
```

**Response:**
```json
{
  "summary": {
    "totalHits": 800,
    "toolsHits": 800,
    "totalDays": 15,
    "averagePerDay": 53.33,
    "peakDay": {
      "date": "2024-01-14",
      "hits": 100
    }
  },
  "breakdown": {
    "tools": 800
  },
  "today": {
    "date": "2024-01-15",
    "total": 30,
    "tools": 30
  },
  "recentDays": [
    {
      "date": "2024-01-15",
      "total": 30,
      "tools": 30
    },
    {
      "date": "2024-01-14",
      "total": 100,
      "tools": 100
    }
  ],
  "note": "Only tracking /api/tools endpoints"
}
```

### 3. Metrics Range Analysis
```
GET /api/metrics/range?days=7&groupBy=day
```

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 7)
- `groupBy` (optional): Grouping method - "day" or "week" (default: "day")

**Response:**
```json
{
  "range": {
    "days": 7,
    "from": "2024-01-09",
    "to": "2024-01-15"
  },
  "summary": {
    "totalHits": 850,
    "averagePerDay": 121.43,
    "peakDay": {
      "date": "2024-01-14",
      "hits": 150
    },
    "lowestDay": {
      "date": "2024-01-12",
      "hits": 45
    }
  },
  "daily": [
    {
      "date": "2024-01-15",
      "total": 45,
      "tools": 30,
      "auth": 10,
      "dashboard": 3,
      "health": 2
    },
    {
      "date": "2024-01-14",
      "total": 150,
      "tools": 100,
      "auth": 30,
      "dashboard": 15,
      "health": 5
    }
  ]
}
```

## Database Schema

### ApiMetrics Collection
```javascript
{
  date: Date,        // YYYY-MM-DD (unique index)
  totalHits: Number,
  endpoints: {
    tools: Number,
    auth: Number,
    dashboard: Number,
    health: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Implementation Details

### 1. Middleware Integration
```javascript
// Automatic tracking di middleware/metrics.js
const hitCounterMiddleware = (req, res, next) => {
  // Track request
  const category = getEndpointCategory(req.path);
  metricsData.total++;
  metricsData.endpoints[category]++;

  // Save to database (background, non-blocking)
  saveMetricsToDb();

  next();
};
```

### 2. Endpoint Categorization
```javascript
function getEndpointCategory(path) {
  if (path.startsWith('/api/tools')) return 'tools';
  if (path.startsWith('/api/auth')) return 'auth';
  if (path.startsWith('/api/dashboard')) return 'dashboard';
  if (path.includes('/health')) return 'health';
  return 'other';
}
```

### 3. Background Database Saving
```javascript
async function saveMetricsToDb() {
  if (saveTimeout) return; // Prevent multiple saves

  saveTimeout = setTimeout(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await ApiMetrics.incrementEndpoint(today, 'total', metricsData.total);
      // ... save other endpoints

      metricsData = { total: 0, endpoints: { tools: 0, auth: 0, dashboard: 0, health: 0 } };
      saveTimeout = null;
    } catch (error) {
      console.error('Error saving metrics:', error);
      saveTimeout = null;
    }
  }, 5000); // Batch save every 5 seconds
}
```

## Usage Examples

### Monitor Daily Traffic
```bash
curl http://localhost:3000/api/metrics
```

### Analyze Last 30 Days
```bash
curl "http://localhost:3000/api/metrics/range?days=30"
```

### Weekly Analysis
```bash
curl "http://localhost:3000/api/metrics/range?days=30&groupBy=week"
```

### Check Real-time Health + Traffic
```bash
curl http://localhost:3000/api/health
```

## Benefits

1. **Persistent Tracking**: Data survives Vercel deployments
2. **Business Intelligence**: Track API usage patterns
3. **Performance Monitoring**: Identify peak usage times
4. **Cost Management**: Monitor API hits for billing
5. **Growth Analysis**: Historical trends and projections
6. **Non-blocking**: Background saves don't affect response time

## Notes

- Metrics data di-batch save setiap 5 detik untuk performance
- Database menggunakan daily aggregation untuk efisiensi storage
- Instance metrics menunjukkan traffic sejak server start
- Total metrics menunjukkan akumulasi sepanjang masa
- Error handling memastikan API tetap berjalan meski database issue

## Production Considerations

- Set MongoDB connection dengan retry logic
- Monitor database storage usage untuk metrics collection
- Consider data retention policy (delete old metrics after 1 year)
- Add indexes pada field `date` untuk query performance
- Setup alerts untuk anomali traffic patterns