# GitHub Roast Tool API Documentation 🔥

## Overview
Tool untuk melakukan "roasting" PEDAS terhadap profil GitHub menggunakan AI Gemini. AI akan menganalisis profil GitHub secara langsung dan menghasilkan roasting yang SAVAGE tapi tetap menghibur dalam bahasa Indonesia gaul!

## Key Features
- 🤖 **AI-Powered**: Menggunakan Gemini AI untuk analisis real-time yang DETAIL
- 🔗 **Direct Access**: AI mengakses GitHub langsung, tidak ada fetch di server
- 🔥 **Roasting Pedas**: Style savage tapi tetap fun dan menghibur
- 😂 **Emote Rich**: Banyak emote ekspresif untuk roasting yang lebih hidup
- 🇮🇩 **Bahasa Gaul**: Roasting dalam bahasa Indonesia dengan slang developer
- 🎯 **Savage Analysis**: Analisis mendalam tentang coding habits yang questionable
- 🤡 **Variatif**: Sapaan pembuka dan style roasting yang beragam

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
    "roast": "Anjay, ketemu lagi sama si @romiyusnandar... 🤡 Bio kosong melompong kayak repository yang belum di-push! Mysterious developer banget nih, foto profil doang yang ada, bio mah males nulis 😂 Join dari 2020 tapi repo cuma 15? Produktivitas santai level dewa ya bang! �\n\nWokwokwok lihat tuh repo-reponya... Ada 'my-awesome-project' yang ternyata cuma hello world doang! 🗿 Awesome is subjective memang ya bro... Terus ada 'test-app' sama 'new-project' - creativity naming level 100! � Yang bikin ngakak, repo-repo lama pada di-abandon kayak ex yang udah move on 💸\n\nContribution graph-nya kering kerontang kayak jokes senior developer! � Weekend warrior banget nih, commit cuma pas deadline mendekat... Followers 50 vs following 200 - rasio hunting mutual Instagram ya? 🤓 Pinned repository cuma 2, sisanya malu-malu di hide 🤦‍♂️\n\nTech stack JavaScript sama Python... mainstream banget dah! 😭 Tapi ya lumayan lah, at least konsisten... Commit message-nya pasti 'fix bug', 'update', 'final version' - classic moves detected! ⚰️\n\nEh tapi honestly bro, tetap semangat ngoding ya! Semua developer hebat pasti pernah punya repo 'test123' kok... Keep pushing code, jangan pushing rank doang! 🚀💪",
    "githubProfile": "https://github.com/romiyusnandar",
    "note": "AI melakukan analisis langsung dari profil GitHub"
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