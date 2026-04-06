require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname) || '.png');
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|bmp)$/i;
    if (allowed.test(file.originalname)) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

app.use(cors());
app.use(express.json());

const { authMiddleware, adminOnly } = require('./middleware/auth');
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', authMiddleware, adminOnly, require('./routes/admin'));

// Proxy analysis to Python AI service
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${AI_SERVICE_URL}/analyze`, formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return res.json({
      ...response.data,
      original_filename: req.file.originalname,
    });
  } catch (err) {
    console.error('AI Service error:', err.message);
    return res.status(502).json({
      error: 'AI service unavailable',
      details: err.response?.data || err.message,
    });
  }
});

// OpenAI Chatbot - explain analysis results
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.post('/api/chat', async (req, res) => {
  const { message, classification, detections } = req.body;

  if (!openai) {
    return res.status(503).json({
      error: 'OpenAI API key not configured. Set OPENAI_API_KEY in .env',
    });
  }

  const systemPrompt = `You are an AI assistant that explains satellite image analysis results. 
You receive classification probabilities (land cover types with percentages) and detected objects.
Provide clear, concise explanations. Be educational about remote sensing and land use.`;

  const context = [];
  if (classification && classification.length) {
    context.push('Land Cover Classification: ' + JSON.stringify(classification));
  }
  if (detections && detections.length) {
    context.push('Detected Objects: ' + JSON.stringify(detections));
  }

  const userContent = context.length
    ? `Context from analysis:\n${context.join('\n')}\n\nUser question: ${message || 'Explain these results'}`
    : (message || 'No analysis context provided.');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      max_tokens: 500,
    });

    return res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    return res.status(502).json({
      error: 'Chatbot service error',
      details: err.message,
    });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
