import React from 'react';
import Card from './Card';

export default function GameBoard({ cards, flippedCards, matchedCards, onFlip, gridCols }) {
  return (
    <div className={`grid ${gridCols} gap-4`}>
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