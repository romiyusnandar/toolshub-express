const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_API_KEY } = require('../config/config');

// @desc    Roast GitHub Profile using AI
// @route   POST /api/tools/github-roast
// @access  Private (requires API key authentication)
const roastGitHubProfile = async (req, res) => {
  try {
    const { username } = req.body;

    // Validation
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username GitHub harus diisi'
      });
    }

    // Initialize Gemini AI with server's API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create roasting prompt with GitHub URLs for AI to fetch directly
    const roastPrompt = createRoastPrompt(username);

    // Generate roast with AI (AI will fetch GitHub data directly)
    const result = await model.generateContent(roastPrompt);
    const roastText = result.response.text();

    res.status(200).json({
      success: true,
      data: {
        username: username,
        roast: roastText,
        githubProfile: `https://github.com/${username}`,
        note: 'AI melakukan analisis langsung dari profil GitHub'
      }
    });

  } catch (error) {
    console.error('GitHub Roast Error:', error);

    if (error.message && error.message.includes('API_KEY_INVALID')) {
      return res.status(500).json({
        success: false,
        error: 'Konfigurasi AI tidak valid'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan saat melakukan roasting',
      details: error.message
    });
  }
};

// Create roasting prompt for AI with GitHub URLs
const createRoastPrompt = (username) => {
  const prompt = `
Kamu adalah seorang comedian developer yang sangat sarkastik dan pintar. Tugasmu adalah melakukan "roasting" (sindiran lucu tapi tidak menyakitkan) terhadap profil GitHub seseorang.

INSTRUKSI:
1. Kunjungi profil GitHub: https://github.com/${username}
2. Analisis semua data yang tersedia:
   - Profil (nama, bio, foto, lokasi, dll)
   - Repository (nama, deskripsi, bahasa, stars, forks)
   - Activity pattern (commit frequency, contribution graph)
   - Following/followers ratio
   - Join date vs repository count
   - Pinned repositories
   - README profil jika ada

3. Buat roasting yang:
   - LUCU dan MENGHIBUR (bukan menyakitkan atau toxic)
   - Menggunakan bahasa Indonesia yang santai dan gaul
   - Fokus pada kebiasaan coding, nama repo yang unik, pattern aktivitas
   - Menganalisis tech stack pilihan
   - Maksimal 3-4 paragraf
   - Berakhir dengan motivasi positif

4. Analisis aspek seperti:
   - Naming convention repository yang aneh/lucu
   - Programming language favorit
   - Commit pattern (rajin atau weekend warrior?)
   - Bio yang kosong, berlebihan, atau unik
   - Repository yang di-pin vs yang tidak
   - Contribution streak atau lack thereof
   - Repository fork vs original ratio

FORMAT OUTPUT:
- Paragraf 1: Opening roast tentang profil umum
- Paragraf 2: Roast tentang repository dan coding style
- Paragraf 3: Roast tentang activity pattern dan habits
- Paragraf 4: Closing dengan motivasi positif tapi tetap roasting

Mulai roasting dengan style yang fun seperti: "Wah, ketemu lagi sama si ${username}..." atau variasi serupa!

TARGET: ${username}
GitHub Profile: https://github.com/${username}
  `;

  return prompt;
};

module.exports = {
  roastGitHubProfile
};