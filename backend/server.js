require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.VOICE_ID;

app.post('/howler', async (req, res) => {
  const text = req.body.text;

  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        'xi-api-key': ELEVEN_API_KEY,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer',
      data: {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.2,
          similarity_boost: 1.0,
          style: 1.0,
          use_speaker_boost: true
        }
      }
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(response.data);
  } catch (err) {
  const raw = err.response?.data;

  if (raw instanceof Buffer) {
    const decoded = raw.toString('utf-8');
    console.error("ElevenLabs error:", JSON.parse(decoded));
  } else {
    console.error("ElevenLabs error:", raw || err.message);
  }

  res.status(500).send('Failed to generate Howler.');
}

});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
