require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Please provide a selection." });
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
