const AnalysisResult = require('../models/AnalysisResult');
const { analyzeScreenshotOrUrl, getRiskLevel } = require('../services/aiDetector');

// @desc    Analyze a website URL and/or uploaded screenshot for deceptive UI patterns
// @route   POST /api/analyze
// @access  Public
exports.analyzeWebsite = async (req, res) => {
  try {
    const { url } = req.body;
    const file = req.file;

    if (!url && !file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a website URL or upload a screenshot to analyze.'
      });
    }

    let screenshotUrl = '';
    if (file) {
      screenshotUrl = `/uploads/${file.filename}`;
    }

    let domain = '';
    if (url) {
      try {
        const formatted = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        const parsed = new URL(formatted);
        domain = parsed.hostname.replace(/^www\./, '');
      } catch (e) {
        domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
      }
    }

    // Execute multi-tier detection (Gemini Vision or Intelligent Heuristics)
    const result = await analyzeScreenshotOrUrl({
      url,
      filePath: file ? file.path : null,
      originalFilename: file ? file.originalname : ''
    });

    const analysis = await AnalysisResult.create({
      url: url || '',
      domain,
      screenshotUrl,
      detectedPatterns: result.patterns,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel || getRiskLevel(result.riskScore),
      summary: result.summary,
      disclaimer: result.disclaimer
    });

    return res.status(200).json({
      success: true,
      analysisId: analysis._id,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel || getRiskLevel(result.riskScore),
      patterns: result.patterns,
      summary: result.summary,
      screenshotUrl,
      domain,
      url,
      analysisEngine: result.analysisEngine,
      disclaimer: result.disclaimer
    });
  } catch (error) {
    console.error('analyzeWebsite error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during dark pattern analysis',
      error: error.message
    });
  }
};
