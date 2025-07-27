// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5001; // You can use any port that's free

// --- Middleware ---
// Enable CORS for all routes, so your frontend can talk to this server
app.use(cors());
// Enable Express to parse JSON request bodies
app.use(express.json());

// --- Routes ---
app.post('/api/summarize', async (req, res) => {
  try {
    // Get the text from the frontend's request
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required in the request body.' });
    }

    // const geminiApiKey = process.env.GEMINI_API_KEY;
    // const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    // --- ADD THIS LINE FOR DEBUGGING ---
    

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

    // Construct the prompt and payload for the Gemini API
    const prompt = `Please provide a concise summary of the following research paper text:\n\n${text}`;
    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    };

    // Make the API call to Gemini using axios
    const geminiResponse = await axios.post(geminiApiUrl, payload);

    // Extract the summary text from Gemini's response
    const summary = geminiResponse.data.candidates[0].content.parts[0].text;

    // Send the summary back to the frontend
    res.json({ summary });

  } catch (error) {
    console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to summarize text.' });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});