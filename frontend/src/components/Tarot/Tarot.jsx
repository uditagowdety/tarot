import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Card from "../Card/Card";
import axios from "axios";
import "./tarot.css";

const tarotDeck = [
    "The Fool", "The Magician", "The High Priestess", "The Empress",
    "The Emperor", "The Hierophant", "The Lovers", "The Chariot",
    "Strength", "The Hermit", "Wheel of Fortune", "Justice",
    "The Hanged Man", "Death", "Temperance", "The Devil",
    "The Tower", "The Star", "The Moon", "The Sun",
    "Judgment", "The World", "Ace of Cups", "Two of Cups",
    "Three of Cups", "Four of Cups", "Five of Cups", "Six of Cups",
    "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups",
    "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups",
    "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles",
    "Four of Pentacles", "Five of Pentacles", "Six of Pentacles",
    "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles",
    "Ten of Pentacles", "Page of Pentacles", "Knight of Pentacles",
    "Queen of Pentacles", "King of Pentacles", "Ace of Swords",
    "Two of Swords", "Three of Swords", "Four of Swords",
    "Five of Swords", "Six of Swords", "Seven of Swords",
    "Eight of Swords", "Nine of Swords", "Ten of Swords",
    "Page of Swords", "Knight of Swords", "Queen of Swords",
    "King of Swords", "Ace of Wands", "Two of Wands",
    "Three of Wands", "Four of Wands", "Five of Wands",
    "Six of Wands", "Seven of Wands", "Eight of Wands",
    "Nine of Wands", "Ten of Wands", "Page of Wands",
    "Knight of Wands", "Queen of Wands", "King of Wands"
];

function Tarot() {
    const [selectedCards, setSelectedCards] = useState([]);
    const [reading, setReading] = useState("");
    const [loading, setLoading] = useState(false);

    const drawCards = () => {
        const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
        const drawnCards = shuffled.slice(0, 3);
        setSelectedCards(drawnCards);
        setReading(""); // Reset reading
    };

    const getReading = async () => {
        if (selectedCards.length !== 3) return;
    
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/interpret", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cards: selectedCards })
            });
    
            const data = await response.json();
            console.log("Frontend Received:", data); // Debugging
    
            // Extract interpretation correctly
            const interpretation = data?.interpretation || "No reading available.";
    
            setReading(interpretation);
        } catch (error) {
            setReading("Error fetching reading. Try again.");
            console.error("Frontend Fetch Error:", error);
        }
        setLoading(false);
    };    

    return (
        <div className="tarot-container">
            <h1>🔮 AI Tarot Card Reader</h1>
            <button onClick={drawCards} className="draw-button">🃏 Draw Cards</button>

            <div className="card-display">
                {selectedCards.map((card, index) => (
                    <Card key={index} name={card} />
                ))}
            </div>

            {selectedCards.length > 0 && (
                <button onClick={getReading} disabled={loading} className="interpret-button">
                    {loading ? "Interpreting..." : "Get Reading"}
                </button>
            )}

            {reading && (
                <div className="reading-container">
                    <h3>Interpretation:</h3>
                    <div className="interpretation">
                        <ReactMarkdown>{reading}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tarot;
