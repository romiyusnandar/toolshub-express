# Toolshub AI Chat API Documentation

## Overview

Toolshub AI Chat API provides AI-powered chat functionality using Google's Gemini 2.5 Flash model. It supports both text-only conversations and multimodal interactions with image uploads.

## Authentication

All endpoints require API key authentication. Include your API key in the request headers:

```
Authorization: Bearer YOUR_API_KEY
```

## Base URL

```
http://localhost:3000/api/tools
```

## Endpoints

### 1. Test API Key

**GET** `/test`

Test your API key authentication and get basic information about available endpoints.

**Response:**
```json
{
  "success": true,
  "message": "API key authentication successful!",
  "data": {
    "message": "Welcome to Toolshub AI Chat API",
    "user": {
      "name": "User Name",
      "email": "user@example.com"
    },
    "apiUsage": {
      "currentHit": 1,
      "totalLimit": 1000,
      "remaining": 999
    },
    "availableEndpoints": [
      "POST /api/tools/chat - Text chat with AI",
      "POST /api/tools/chat-with-image - Chat with image support",
      "GET /api/tools/chat/history/:id - Get conversation history",
      "GET /api/tools/models - Get available AI models"
    ]
  }
}
```

### 2. Get Available Models

**GET** `/models`

Get information about available AI models.

**Response:**
```json
{
  "success": true,
  "data": {
    "models": [
      {
        "name": "gemini-2.5-flash",
        "description": "Fast and efficient model for general tasks",
        "capabilities": ["text", "images", "multimodal"],
        "maxTokens": 4096,
        "default": true
      }
    ]
  }
}
```

### 3. Text Chat

**POST** `/chat`

Send a text message to the AI and get a response.

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "conversationId": "optional_conversation_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Hello! I'm doing well, thank you for asking. How can I help you today?",
    "conversationId": "conv_1699123456789_user123",
    "timestamp": "2023-11-05T10:30:45.123Z",
    "model": "gemini-2.5-flash",
    "type": "text"
  }
}
```

### 4. Chat with Image

**POST** `/chat-with-image`

Send a message with an image attachment to the AI.

**Request:** Multipart form data
- `message` (text, optional): Text message
- `image` (file, required): Image file (JPEG, PNG, WebP, etc.)
- `conversationId` (text, optional): Conversation ID

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/tools/chat-with-image \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "message=What do you see in this image?" \
  -F "image=@path/to/your/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I can see a beautiful sunset over the ocean with orange and pink colors in the sky...",
    "conversationId": "conv_1699123456789_user123",
    "timestamp": "2023-11-05T10:30:45.123Z",
    "model": "gemini-2.5-flash",
    "type": "multimodal",
    "hasImage": true,
    "imageInfo": {
      "originalName": "sunset.jpg",
      "mimeType": "image/jpeg",
      "size": 1048576
    }
  }
}
```

### 5. Get Chat History

**GET** `/chat/history/:conversationId`

Get conversation history for a specific conversation ID.

**Note:** This is currently a placeholder endpoint. Conversation history is not persisted.

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_1699123456789_user123",
    "messages": [],
    "note": "Conversation history feature is not implemented yet. Each request is currently stateless."
  }
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode)"
}
```

### Common Error Codes:

- **400 Bad Request**: Missing required parameters
- **401 Unauthorized**: Invalid or missing API key
- **413 Payload Too Large**: Image file too large (max 10MB)
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Rate Limits

API calls are subject to rate limiting based on your API key plan. Check your usage in the test endpoint response.

## File Upload Specifications

### Supported Image Formats:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- BMP (.bmp)

### File Size Limits:
- Maximum file size: 10MB per image
- Single image per request

## Usage Examples

### Example 1: Simple Text Chat

```javascript
const response = await fetch('http://localhost:3000/api/tools/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Explain quantum computing in simple terms'
  })
});

const data = await response.json();
console.log(data.data.response);
```

### Example 2: Chat with Image

```javascript
const formData = new FormData();
formData.append('message', 'What is in this image?');
formData.append('image', imageFile);

const response = await fetch('http://localhost:3000/api/tools/chat-with-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const data = await response.json();
console.log(data.data.response);
```

## Setup Instructions

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add it to your `.env` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Register for a Toolshub API account to get your API key
4. Start making requests!

## Support

For support and questions, please contact the Toolshub team or check the API documentation.