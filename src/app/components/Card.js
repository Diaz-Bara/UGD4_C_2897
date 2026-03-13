import React from 'react';
import { FaQuestion } from 'react-icons/fa';

function Card({ card, isFlipped, isMatched, onFlip }) {
  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onFlip(card.id);
    }
  };

  const isOpen = isFlipped || isMatched;
  const IconComponent = card.icon;

  const cardClass = `w-20 h-20 flex items-center justify-center text-3xl rounded-xl cursor-pointer select-none transition-all duration-300 transform 
  ${isOpen ? 'bg-white shadow-md scale-100' : 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg hover:scale-105 hover:shadow-xl'} 
  ${isMatched ? 'opacity-70 ring-2 ring-green-400' : ''}`;

  return (
    <div onClick={handleClick} className={cardClass}>
      {}
      {isOpen ? (
        <span className="animate-bounce-once">
          <IconComponent style={{ color: card.color }} />
        </span>
      ) : (
        <FaQuestion className="text-white/60 text-xl" />
      )}
    </div>
  );
}

export default Card;