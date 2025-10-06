const mongoose = require('mongoose');

const apiMetricsSchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    unique: true,
    index: true
  },
  totalHits: {
    type: Number,
    default: 0
  },
  toolsHits: {
    type: Number,
    default: 0
  },
  endpoints: {
    type: Map,
    of: Number,
    default: new Map()
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
apiMetricsSchema.index({ lastUpdated: -1 });

// Method to increment hit count for specific endpoint
apiMetricsSchema.methods.incrementEndpoint = function(endpoint) {
  const current = this.endpoints.get(endpoint) || 0;
  this.endpoints.set(endpoint, current + 1);
  this.lastUpdated = new Date();
  return this.save();
};

// Static method to get or create today's metrics
apiMetricsSchema.statics.getTodayMetrics = async function() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  let metrics = await this.findOne({ date: today });
  if (!metrics) {
    metrics = await this.create({ date: today });
  }

  return metrics;
};

// Static method to get total metrics (tools only)
apiMetricsSchema.statics.getTotalMetrics = async function() {
  const result = await this.aggregate([
    {
      $group: {
        _id: null,
        totalHits: { $sum: '$totalHits' },
        toolsHits: { $sum: '$toolsHits' }
      }
    }
  ]);

  return result.length > 0 ? result[0] : {
    totalHits: 0,
    toolsHits: 0
  };
};

module.exports = mongoose.model('ApiMetrics', apiMetricsSchema);