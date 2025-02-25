import React, { useState } from "react";
import "./Card.css";

function Card({ name, reversed }) {
    const [flipped, setFlipped] = useState(false);

    // Convert card name into a file-friendly format (for images)
    const cardImage = `/cards/${name.replace(/ /g, "-").toLowerCase()}.jpg`;
    const cardBack = `/cards/CardBacks.jpg`

    return (
        <div 
            className={`tarot-card ${flipped ? "flipped" : ""} ${reversed ? "reversed" : ""}`}
            onClick={() => setFlipped(!flipped)}
        >
            <div className="card-inner">
                <div className="card-front">
                    <img 
                        src={cardImage} 
                        alt={name} 
                        className="card-image"
                        style={{ transform: reversed ? "rotate(180deg)" : "none" }}
                    />
                </div>
                <div className="card-back">
                    <img src={cardBack} alt="🔮" className="card-image" />
                </div>
            </div>
        </div>
    );
}

export default Card;
