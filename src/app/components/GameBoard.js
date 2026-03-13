import React from 'react';
import Card from './Card';

function GameBoard({ cards, flippedCards, matchedCards, onFlip }) {
  return (
    
    <div className="grid grid-cols-4 gap-4 justify-items-center">
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          isFlipped={flippedCards.includes(card.id)}
          isMatched={matchedCards.includes(card.id)}
          onFlip={onFlip}
        />
      ))}
    </div>
  );
}

export default GameBoard;