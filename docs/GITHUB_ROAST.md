# GitHub Roast Tool API Documentation

## Overview
Tool untuk melakukan "roasting" (sindiran lucu) terhadap profil GitHub menggunakan AI Gemini. AI akan mengakses dan menganalisis profil GitHub secara langsung tanpa perlu fetch data di server, menghasilkan roasting yang menghibur dalam bahasa Indonesia.

## Key Features
- 🤖 **AI-Powered**: Menggunakan Gemini AI untuk analisis real-time
- 🔗 **Direct Access**: AI mengakses GitHub langsung, tidak ada fetch di server
- 🇮🇩 **Bahasa Indonesia**: Roasting dalam bahasa yang santai dan gaul
- 🎯 **Targeted Analysis**: Fokus pada coding habits, repo patterns, dan activity
- ✨ **Entertainment**: Fun dan menghibur, bukan untuk menyakiti

## Endpoint

### POST /api/tools/github-roast

Melakukan roasting terhadap profil GitHub user menggunakan AI.

**Authentication:** Menggunakan API Key sistem melalui header `X-API-Key`. Tidak perlu input API key Gemini.

**Request:**
```http
POST /api/tools/github-roast
Content-Type: application/json
X-API-Key: your_toolshub_api_key

{
  "username": "github_username"
}
```

**Parameters:**
- `username` (string, required): Username GitHub yang ingin di-roast
- `apiKey` (string, required): Google Gemini API key untuk AI processing

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "username": "romiyusnandar",
    "roast": "Wah, lihat siapa ini... @romiyusnandar, si mysterious developer yang terlalu cool untuk nulis bio! 🕵️ Sudah join GitHub dari 2020 tapi cuma punya 15 repos public - produktivitas level santai ya bang? 😄\n\nDilihat dari repository-nya, kayaknya lagi seneng banget sama JavaScript dan Python nih. Ada repo 'my-awesome-project' dengan 0 stars - well, awesome is relative ya! 🌟 Tapi yang bikin ketawa, ada repo 'hello-world' yang last update-nya 2 tahun lalu. Classic move! 👨‍💻\n\nFollowers 50, following 200 - rasio social media vibes banget! Kayak lagi hunting mutual atau gimana? 😂 Recent activity-nya mostly PushEvent sama CreateEvent, berarti masih rajin coding lah ya. Lumayan!\n\nTapi jokes aside, keep coding dan tetap semangat explore teknologi baru! Every great developer started with 'hello-world' kok! 🚀💪",
    "profileData": {
      "name": "Romi Yusnandar",
      "bio": null,
      "publicRepos": 15,
      "followers": 50,
      "following": 200,
      "joinDate": "2020-05-15T08:30:00Z"
    }
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Username GitHub harus diisi"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "User GitHub 'nonexistent_user' tidak ditemukan"
}
```

**Response Error (401):**
```json
{
  "success": false,
  "error": "API key tidak valid"
}
```

**Response Error (500):**
```json
{
  "success": false,
  "error": "Terjadi kesalahan saat melakukan roasting",
  "details": "Detailed error message"
}
```

## Features

### GitHub Data Analysis
Tool ini menganalisis:
- **Profile Data**: Nama, bio, tanggal bergabung, followers/following
- **Repository Analysis**: Nama repo, bahasa pemrograman, stars, forks, deskripsi
- **Activity Pattern**: Jenis aktivitas terakhir (commits, create repo, dll)
- **Coding Habits**: Frequency, consistency, dan pattern development

### AI Roasting Style
- **Bahasa Indonesia** santai dan menghibur
- **Tidak menyakitkan** - fokus pada hal lucu tapi tetap positif
- **Berdasarkan data real** - analisis actual GitHub activity
- **Motivasi positif** - selalu diakhiri dengan encouragement

## Usage Examples

### Example 1: Basic Roast
```bash
curl -X POST http://localhost:3000/api/tools/github-roast \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "username": "torvalds",
    "apiKey": "your_gemini_api_key"
  }'
```

### Example 2: Using Fetch
```javascript
const response = await fetch('/api/tools/github-roast', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_api_key'
  },
  body: JSON.stringify({
    username: 'gaearon',
    apiKey: 'your_gemini_api_key'
  })
});

const result = await response.json();
console.log(result.data.roast);
```

## Rate Limiting
- **Rate Limit**: 100 requests per 15 minutes per API key
- **Concurrent Requests**: Max 5 concurrent requests per IP

## Error Handling

### Common Errors:
1. **Invalid Username**: GitHub user tidak ditemukan
2. **Invalid API Key**: Gemini API key tidak valid atau expired
3. **Rate Limit**: GitHub API rate limit exceeded
4. **Network Error**: Gagal mengakses GitHub API

### Best Practices:
- Validasi username sebelum request
- Handle rate limiting dengan retry mechanism
- Cache results untuk username yang sama (optional)
- Provide user feedback untuk slow responses

## Security Notes
- API key Gemini dikirim melalui request body (tidak disimpan di server)
- Semua requests memerlukan API key authentication
- Data GitHub yang di-fetch adalah public data saja
- No sensitive information exposed

## Dependencies
- Google Generative AI SDK
- node-fetch untuk GitHub API requests
- Express rate limiting middleware

## Changelog

### v1.0.0 (2025-10-07)
- Initial release
- Basic GitHub profile roasting
- Repository analysis
- Activity pattern detection
- Indonesian language support