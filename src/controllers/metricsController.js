const ApiMetrics = require('../models/ApiMetrics');
const { getDetailedMetrics } = require('../middleware/metrics');

// @desc    Get API metrics summary (tools only)
// @route   GET /api/metrics
// @access  Public
const getMetrics = async (req, res) => {
  try {
    const detailedMetrics = await getDetailedMetrics();

    if (!detailedMetrics) {
      return res.status(500).json({
        success: false,
        message: 'Error retrieving metrics'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          allTimeHits: detailedMetrics.allTime.totalHits,
          allTimeToolsHits: detailedMetrics.allTime.toolsHits,
          todayHits: detailedMetrics.today.totalHits,
          todayToolsHits: detailedMetrics.today.toolsHits
        },
        breakdown: {
          allTime: detailedMetrics.allTime,
          today: detailedMetrics.today,
          currentInstance: detailedMetrics.currentInstance
        },
        note: 'Only tracking /api/tools endpoints',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get Metrics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving API metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get detailed metrics for specific date range
// @route   GET /api/metrics/range
// @access  Public
const getMetricsRange = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;

    let filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const metrics = await ApiMetrics.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    const totalStats = await ApiMetrics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalHits: { $sum: '$totalHits' },
          totalApiHits: { $sum: '$apiHits' },
          totalToolsHits: { $sum: '$toolsHits' },
          totalAuthHits: { $sum: '$authHits' },
          totalDashboardHits: { $sum: '$dashboardHits' },
          avgDailyHits: { $avg: '$totalHits' },
          maxDailyHits: { $max: '$totalHits' },
          daysCount: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: totalStats.length > 0 ? totalStats[0] : {
          totalHits: 0,
          totalApiHits: 0,
          avgDailyHits: 0,
          maxDailyHits: 0,
          daysCount: 0
        },
        dailyMetrics: metrics,
        query: {
          startDate,
          endDate,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get Metrics Range Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving metrics range',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getMetrics,
  getMetricsRange
};