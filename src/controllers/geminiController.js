const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_API_KEY } = require('../config/config');
const multer = require('multer');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow image files and some document types
    const allowedTypes = [
      'image/',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  }
});

// Helper function to convert buffer to generative part
function bufferToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType: mimeType
    }
  };
}

// @desc    Chat with Gemini AI (supports text and file)
// @route   POST /api/tools/chat-gemini
// @access  API Key Required
const chatGemini = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const { user } = req;
    const file = req.file;

    // Validate that at least message or file is provided
    if (!message && !file) {
      return res.status(400).json({
        success: false,
        message: 'Either message or file is required'
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });

    // Prepare the prompt parts
    const promptParts = [];

    // Add file if provided
    if (file) {
      const filePart = bufferToGenerativePart(file.buffer, file.mimetype);
      promptParts.push(filePart);
    }

    // Add text message if provided
    if (message) {
      promptParts.push(message);
    }

    // Generate response
    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      data: {
        response: text,
        conversationId: conversationId || `conv_${Date.now()}_${user.id}`,
        timestamp: new Date().toISOString(),
        model: "gemini-2.5-flash",
        type: file ? "multimodal" : "text",
        hasFile: !!file,
        fileInfo: file ? {
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size
        } : null
      }
    });

  } catch (error) {
    console.error('Chat Gemini Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get available Gemini models
// @route   GET /api/tools/gemini/models
// @access  API Key Required
const getGeminiModels = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        models: [
          {
            name: "gemini-2.5-flash",
            description: "Fast and efficient model for general tasks",
            capabilities: ["text", "images", "documents", "multimodal"],
            maxTokens: 4096,
            default: true
          },
          {
            name: "gemini-pro",
            description: "Advanced model for complex reasoning tasks",
            capabilities: ["text", "images", "documents", "multimodal"],
            maxTokens: 8192,
            default: false
          }
        ],
        supportedFileTypes: [
          "image/jpeg", "image/png", "image/gif", "image/webp",
          "application/pdf", "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
      }
    });

  } catch (error) {
    console.error('Get Gemini Models Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving Gemini models',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Test Gemini API connection
// @route   GET /api/tools/gemini/test
// @access  API Key Required
const testGemini = async (req, res) => {
  try {
    const { user } = req;

    // Test with a simple prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say hello in a friendly way");
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      message: 'Gemini AI connection successful!',
      data: {
        testResponse: text,
        user: {
          name: user.name,
          email: user.email
        },
        geminiInfo: {
          model: "gemini-2.5-flash",
          status: "connected",
          capabilities: ["text", "images", "documents", "multimodal"]
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Test Gemini Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing Gemini connection',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  chatGemini: [upload.single('file'), chatGemini],
  getGeminiModels,
  testGemini
};