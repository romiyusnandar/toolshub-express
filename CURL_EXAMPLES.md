# Contoh Request Gemini Chat API menggunakan CMD (Windows)

## Prerequisites
1. Pastikan server sudah berjalan di `http://localhost:3000`
2. Dapatkan API key dari registrasi/login di aplikasi
3. Ganti `YOUR_API_KEY` dengan API key yang valid

---

## 1. Test API Key Authentication

```cmd
curl -X GET "http://localhost:3000/api/tools/test" ^
     -H "x-api-key: YOUR_API_KEY" ^
     -H "Content-Type: application/json"
```

---

## 2. Get Available Tools

```cmd
curl -X GET "http://localhost:3000/api/tools" ^
     -H "x-api-key: YOUR_API_KEY" ^
     -H "Content-Type: application/json"
```

---

## 3. Chat Gemini - Text Only

### Simple Text Chat
```cmd
curl -X POST "http://localhost:3000/api/tools/chat-gemini" ^
     -H "x-api-key: YOUR_API_KEY" ^
     -H "Content-Type: application/json" ^
     -d "{\"message\": \"Halo, jelaskan tentang artificial intelligence dalam bahasa Indonesia\"}"
```

### Text Chat dengan Conversation ID
```cmd
curl -X POST "http://localhost:3000/api/tools/chat-gemini" ^
     -H "x-api-key: YOUR_API_KEY" ^
     -H "Content-Type: application/json" ^
     -d "{\"message\": \"Lanjutkan pembahasan sebelumnya\", \"conversationId\": \"conv_123456\"}"
```

---

## 4. Chat Gemini - File Upload

### Upload Image Only
```cmd
curl -X POST "http://localhost:3000/api/tools/chat-gemini" ^
     -H "x-api-key: YOUR_API_KEY" ^
     -F "file=@C:\\path\\to\\your\\image.jpg"
```

### Upload Image dengan Text
```cmd
curl -X POST "http://localhost:3000/api/tools/chat-gemini" ^
     -H "x-api-key: YOUR_API_KEY" ^
     -F "message=Analisis gambar ini dan jelaskan apa yang kamu lihat" ^
     -F "file=@C:\\path\\to\\your\\image.jpg"
```

### Upload PDF dengan Text
```cmd
curl -X POST "http://localhost:3000/api/tools/chat-gemini" ^
     -H "x-api-key: YOUR_API_KEY" ^
     -F "message=Ringkas dokumen PDF ini" ^
     -F "file=@C:\\path\\to\\document.pdf"
```

---

## 5. Get Gemini Models

```cmd
curl -X GET "http://localhost:3000/api/tools/gemini/models" ^
     -H "x-api-key: YOUR_API_KEY" ^
     -H "Content-Type: application/json"
```

---

## 6. Test Gemini Connection

```cmd
curl -X GET "http://localhost:3000/api/tools/gemini/test" ^
     -H "x-api-key: YOUR_API_KEY" ^
     -H "Content-Type: application/json"
```

---

## 7. Get Chat History (Placeholder)

```cmd
curl -X GET "http://localhost:3000/api/tools/chat/history/conv_123456" ^
     -H "x-api-key: YOUR_API_KEY" ^
     -H "Content-Type: application/json"
```

---

## Contoh Response Success

### Text Chat Response:
```json
{
  "success": true,
  "data": {
    "response": "Artificial Intelligence (AI) atau Kecerdasan Buatan adalah teknologi yang memungkinkan mesin untuk belajar, berpikir, dan mengambil keputusan seperti manusia...",
    "conversationId": "conv_1728123456789_user123",
    "timestamp": "2025-10-05T12:30:45.123Z",
    "model": "gemini-2.5-flash",
    "type": "text",
    "hasFile": false,
    "fileInfo": null
  }
}
```

### File Upload Response:
```json
{
  "success": true,
  "data": {
    "response": "Saya dapat melihat gambar yang Anda kirim. Ini adalah foto pemandangan sunset yang indah...",
    "conversationId": "conv_1728123456789_user123",
    "timestamp": "2025-10-05T12:30:45.123Z",
    "model": "gemini-2.5-flash",
    "type": "multimodal",
    "hasFile": true,
    "fileInfo": {
      "originalName": "sunset.jpg",
      "mimeType": "image/jpeg",
      "size": 1048576
    }
  }
}
```

---

## Error Handling

### 401 - Invalid API Key:
```json
{
  "success": false,
  "message": "Invalid API key"
}
```

### 400 - Missing Message/File:
```json
{
  "success": false,
  "message": "Either message or file is required"
}
```

### 413 - File Too Large:
```json
{
  "success": false,
  "message": "File too large. Maximum size is 10MB"
}
```

---

## Tips untuk Windows CMD:

1. **Escape Characters**: Gunakan `^` untuk line continuation di CMD
2. **JSON Quotes**: Gunakan double quotes untuk JSON dan escape dengan backslash: `\"`
3. **File Paths**: Gunakan full path dengan double backslash: `C:\\folder\\file.jpg`
4. **Header Format**: Gunakan format `-H "header: value"`

---

## Contoh Lengkap Penggunaan:

### Step 1: Test Connection
```cmd
curl -X GET "http://localhost:3000/api/tools/test" -H "x-api-key: abcd1234efgh5678"
```

### Step 2: Simple Chat
```cmd
curl -X POST "http://localhost:3000/api/tools/chat-gemini" ^
     -H "x-api-key: abcd1234efgh5678" ^
     -H "Content-Type: application/json" ^
     -d "{\"message\": \"Halo Gemini!\"}"
```

### Step 3: Chat dengan Gambar
```cmd
curl -X POST "http://localhost:3000/api/tools/chat-gemini" ^
     -H "x-api-key: abcd1234efgh5678" ^
     -F "message=Jelaskan gambar ini" ^
     -F "file=@C:\\Users\\Username\\Desktop\\photo.jpg"
```

---

## Supported File Types:
- **Images**: JPG, JPEG, PNG, GIF, WebP, BMP
- **Documents**: PDF, TXT, DOC, DOCX
- **Size Limit**: Maximum 10MB per file