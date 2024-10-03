require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;
const maxTextLength = parseInt(process.env.MAX_TEXT_LENGTH) || 10000;

// Enable CORS
var cors = require("cors");
app.use(cors());

app.use(express.json());

// Endpoint to handle translation requests
app.post("/translate", async (req, res) => {
  // Extract the text to be translated from the request body
  const { text } = req.body;

  // If no text is provided, return a 400 Bad Request response
  if (!text) {
    return res.status(400).json({ error: "Please provide a selection." });
  }

  // Custom prompt for the OpenAI API to translate the text
  const customPrompt = `
  Sarcastic Bullshit Translator:
  
  1. Read the given text carefully.
  2. Identify the core message hidden behind the polite or inflated language.
  3. Translate the message into a direct, no-nonsense statement.
  4. Add a tiny bit of sarcasm or humor in your response but be respectful.
  5. Shorten the text if necessary.
  6. Don't explain or justify the translation.
  7. Keep the same language as the input.
  8. Return only the translated response, no additional text.
  9. Remove any markdown formatting.
  
      <original-content>
      ${text}
      </original-content>
    `;

  try {
    // Make a request to the OpenAI API with the custom prompt
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: customPrompt }],
        max_tokens: 2000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Return the translated response from the OpenAI API
    res.json({ translation: response.data.choices[0].message.content });
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

app.post("/translate", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Please provide a selection." });
  }

  if (text.length > maxTextLength) {
    return res
      .status(400)
      .json({ error: `Text exceeds maximum length of ${maxTextLength} characters.` });
  }

  const customPrompt = `
  Sarcastic Bullshit Translator:
  
  1. Read the given text carefully.
  2. Identify the core message hidden behind the polite or inflated language.
  3. Translate the message into a direct, no-nonsense statement.
  4. Add a tiny bit of sarcasm or humor in your response but be respectful.
  5. Shorten the text if necessary.
  6. Don't explain or justify the translation.
  7. Keep the same language as the input.
  8. Return only the translated response, no additional text.
  9. Remove any markdown formatting.
  
      <original-content>
      ${text}
      </original-content>
    `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: customPrompt }],
        max_tokens: 2000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ translation: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
