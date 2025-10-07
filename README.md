# Toolshub API

Modern Express backend with clean, maintainable architecture.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment**
   ```bash
   copy .env.example .env
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Test endpoints**
   - Health: http://localhost:3000/api/health
   - Welcome: http://localhost:3000/api/

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   └── config.js     # App configuration (PORT, NODE_ENV)
├── controllers/      # Route handlers & business logic
│   └── healthController.js
├── middleware/       # Custom middleware
│   ├── index.js      # Middleware setup
│   └── metrics.js    # Hit counter & server metrics
├── routes/           # API route definitions
│   └── index.js      # Main router
├── utils/            # Utility functions
│   └── systemUtils.js # System monitoring utilities
└── index.js          # Application entry point
```

## 🏗️ Architecture Principles

### **Separation of Concerns**
- **Controllers**: Handle HTTP requests/responses and business logic
- **Routes**: Define API endpoints and map to controllers
- **Middleware**: Reusable functions for request processing
- **Utils**: Pure functions for common operations
- **Config**: Centralized configuration management

### **Modular Design**
- Each module has a single responsibility
- Easy to test and maintain
- Scalable for larger applications

## 📊 API Endpoints

### Health Check
```http
GET /api/health
```

Returns comprehensive server metrics:
- Server uptime and environment
- Memory usage (process & system)
- CPU information and load average
- Traffic analytics
- System information

### Welcome
```http
GET /api/
```

Returns welcome message.

## 🛠️ Available Tools

### 1. Gemini AI Chat
```http
POST /api/tools/chat
```

Chat dengan AI Gemini dengan dukungan multimodal (text + file upload).

**Features:**
- Text conversation dengan AI
- Upload dan analisis file (gambar, PDF, dokumen)
- Conversation history tracking
- API key authentication

### 2. GitHub Profile Roaster 🔥
```http
POST /api/tools/github-roast
```

Roasting lucu terhadap profil GitHub menggunakan AI.

**Features:**
- Analisis profil GitHub comprehensive oleh AI langsung
- Roasting dalam bahasa Indonesia yang fun
- AI mengakses repository, activity, dan semua data GitHub
- Tidak perlu input API key Gemini (menggunakan sistem)

**Request:**
```json
{
  "username": "github_username"
}
```

**Headers:**
```
X-API-Key: your_toolshub_api_key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "romiyusnandar",
    "roast": "Wah, ketemu lagi sama si @romiyusnandar... Ini developer yang mysterius banget, bio kosong melompong kayak repository yang belum di-push! �...",
    "githubProfile": "https://github.com/romiyusnandar",
    "note": "AI melakukan analisis langsung dari profil GitHub"
  }
}
```
```

### Tool Documentation
- [Gemini Chat API](./docs/GEMINI_CHAT.md)
- [GitHub Roast API](./docs/GITHUB_ROAST.md)

## 🔧 Development

### Adding New Routes

1. **Create controller** in `src/controllers/`
   ```javascript
   const getUsers = (req, res) => {
     res.json({ users: [] });
   };

   module.exports = { getUsers };
   ```

2. **Add routes** in `src/routes/`
   ```javascript
   const { getUsers } = require('../controllers/userController');
   router.get('/users', getUsers);
   ```

3. **Register routes** in main router

### Adding Middleware

1. Create in `src/middleware/`
2. Export from `src/middleware/index.js`
3. Apply in `setupMiddleware()`

### Adding Utilities

1. Create pure functions in `src/utils/`
2. Export for reuse across controllers

## 🧪 Testing

```bash
# Run tests (when added)
npm test

# Health check
curl http://localhost:3000/api/health
```

## 📦 Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **nodemon**: Development auto-reload

## 🚀 Deployment

For production:

```bash
npm start
```

Environment variables:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## 📈 Next Steps

- [ ] Add authentication middleware
- [ ] Implement database integration
- [ ] Add input validation
- [ ] Setup logging (Winston/Morgan)
- [ ] Add API documentation (Swagger)
- [ ] Implement rate limiting
- [ ] Add unit tests (Jest)
- [ ] Setup CI/CD pipeline
