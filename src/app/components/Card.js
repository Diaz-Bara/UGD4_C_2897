import React from 'react';

export default function Card({ card, isFlipped, isMatched, onFlip }) {
  const isOpen = isFlipped || isMatched;
  const IconComponent = card.icon;

  return (
    <div 
      onClick={() => !isOpen && onFlip(card.id)}
      className={`w-20 h-24 flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-500 transform 
      ${isOpen 
        ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)] rotate-0' 
        : 'bg-gradient-to-br from-[#c471ed] via-[#f64f59] to-[#c471ed] shadow-lg hover:scale-105 -rotate-2'
      } 
      ${isMatched ? 'opacity-80 scale-95' : ''}`}
    >
      {isOpen ? (
        <IconComponent className="text-4xl animate-bounce-once" style={{ color: card.color }} />
      ) : (
        <span className="text-white text-3xl font-bold opacity-50">?</span>
      )}
    </div>
  );
}