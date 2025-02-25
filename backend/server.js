require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/interpret", async (req, res) => {
    try {
        const { cards } = req.body;
        console.log("Received API request with cards:", cards);

        if (!cards || !Array.isArray(cards) || cards.length !== 3) {
            return res.status(400).json({ error: "Invalid card selection. Please pick exactly 3 cards." });
        }

        // Safer AI Prompt to avoid content restrictions
        const prompt = `I drew three tarot cards: ${cards.join(", ")}. 
        Please provide a general interpretation in a neutral, educational, and historical way. 
        Avoid any predictions or sensitive topics. Just explain their meanings traditionally. Please provide a traditional interpretation with **bold card names** and clear formatting for readability.`;

        console.log("Sending request to Gemini API...");

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            }
        );

        console.log("AI Raw Response:", JSON.stringify(response.data, null, 2));

        // Extract AI-generated text safely
        const interpretation = response.data?.candidates?.[0]?.content?.parts
            ?.map(part => part.text)
            ?.join("\n") || "No reading available.";

        console.log("Extracted Interpretation:", interpretation);

        res.json({ interpretation });
    } catch (error) {
        console.error("Error fetching AI response:", error.response?.data || error.message);
        res.status(500).json({ error: "Error generating reading. Please try again." });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
