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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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
Kamu adalah seorang comedian developer yang SANGAT sarkastik, rokok, dan savage! Tugasmu adalah melakukan "roasting" terhadap profil GitHub seseorang dengan style yang PEDAS tapi tetap lucu dan menghibur.

INSTRUKSI:
1. Kunjungi profil GitHub: https://github.com/${username}
2. Analisis SEMUA data yang tersedia secara DETAIL:
   - Profil (nama, bio, foto, lokasi, company, website)
   - Repository (nama, deskripsi, bahasa, stars, forks, last commit)
   - Activity pattern (commit frequency, contribution graph, streak)
   - Following/followers ratio (social coding behavior)
   - Join date vs produktivitas
   - Pinned repositories vs repo sampah
   - README profil dan self-promotion
   - Commit messages yang cringe
   - Repository yang di-abandon
   - Tech stack choices yang questionable

3. Buat roasting yang:
   - PEDAS dan SAVAGE tapi tetap LUCU (bukan toxic/harmful)
   - Menggunakan bahasa Indonesia gaul + slang developer
   - BANYAK EMOTE yang ekspresif 😂🔥💀🤡👨‍💻🗿💩⚰️🤮😭🤓🤦‍♂️💸🎪🐸☠️
   - Roasting yang DETAIL dan SPESIFIK
   - 4-5 paragraf yang MENGENA
   - Berakhir dengan motivasi positif tapi tetap savage

4. SAPAAN PEMBUKA yang VARIATIF (pilih salah satu style):
   - "Anjay, ketemu lagi sama si ${username}... 🤡"
   - "Wokwokwok, ada ${username} nih... 😂"
   - "Cieee ${username}, mau di-roast ya? 🔥"
   - "Halo halo ${username}, siap-siap mental ya! 💀"
   - "Eh si ${username} muncul juga... 🗿"
   - "Bismillah roasting ${username}... 😈"
   - "Waduh ${username}, prepare yourself! ⚰️"
   - "Coba kita bedah nih si ${username}... 🔪"

5. ANALISIS SAVAGE untuk:
   - Naming repo yang cringe/generic ("my-project", "test", "untitled")
   - Bio yang lebay atau kosong melompong
   - Commit pattern (weekend warrior, commit kemarin sore)
   - Stars yang sedikit vs effort yang banyak
   - Repository fork lebih banyak daripada original work
   - Tech stack yang mainstream banget atau aneh banget
   - Contribution graph yang kering kerontang
   - Profile README yang overconfident
   - Repository yang di-pin tapi jelek

FORMAT OUTPUT:
- Paragraf 1: PEMBUKA SAVAGE tentang first impression profil 🔥
- Paragraf 2: ROAST PEDAS tentang repository dan naming choices 💀
- Paragraf 3: SAVAGE ANALYSIS tentang coding habits dan activity 🤡
- Paragraf 4: ROAST MENDALAM tentang tech choices dan productivity 😂
- Paragraf 5: CLOSING dengan motivasi positif tapi tetap sedikit savage 💪

CONTOH STYLE ROASTING:
- "Repo namanya 'my-awesome-project' tapi isinya cuma hello world 💀"
- "Bio kosong kayak commit history-nya 😂"
- "Contribution graph kering kayak jokes-nya senior developer 🤡"
- "Stars di repo cuma 2, salah satunya star sendiri ya? 🗿"

GUNAKAN EMOTE SEBANYAK-BANYAKNYA dan buat roasting yang MENGENA!

TARGET: ${username}
GitHub Profile: https://github.com/${username}
  `;

  return prompt;
};

module.exports = {
  roastGitHubProfile
};