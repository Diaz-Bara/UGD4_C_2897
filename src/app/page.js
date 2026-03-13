'use client';

import React, { useState, useEffect, useRef } from 'react';
import GameBoard from './components/GameBoard'; 
import ScoreBoard from './components/ScoreBoard';

// Tambahkan lebih banyak ikon untuk level yang lebih sulit
import { FaAppleAlt, FaLemon, FaHeart, FaStar, FaGhost, FaIceCream, FaRocket, FaMoon } from 'react-icons/fa';

const Icons = [
  { icon: FaAppleAlt, color: '#FF6B6B' },
  { icon: FaLemon, color: '#FFD93D' },
  { icon: FaHeart, color: '#FF6B6B' },
  { icon: FaStar, color: '#FFD93D' },
  { icon: FaGhost, color: '#f8fafc' },
  { icon: FaIceCream, color: '#fbbf24' },
  { icon: FaRocket, color: '#38bdf8' },
  { icon: FaMoon, color: '#818cf8' },
];

const DIFFICULTY_SETTINGS = {
  easy: { pairs: 4, gridCols: 'grid-cols-4' },
  medium: { pairs: 6, gridCols: 'grid-cols-4' },
  hard: { pairs: 8, gridCols: 'grid-cols-4' },
};

const shufflearray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Home() {
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const createCards = (level) => {
    const numPairs = DIFFICULTY_SETTINGS[level].pairs;
    const selectedIcons = Icons.slice(0, numPairs);
    const paired = selectedIcons.flatMap((item, index) => [
      { id: index * 2, icon: item.icon, color: item.color, pairId: index },
      { id: index * 2 + 1, icon: item.icon, color: item.color, pairId: index },
    ]);
    return shufflearray(paired);
  };

  // Inisialisasi Game
  useEffect(() => {
    resetGame();
  }, [difficulty]);

  // Logika Timer
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  // Cek Kemenangan untuk stop timer
  useEffect(() => {
    if (matchedCards.length === DIFFICULTY_SETTINGS[difficulty].pairs * 2 && matchedCards.length !== 0) {
      setIsActive(false);
    }
  }, [matchedCards, difficulty]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      setMoves(prev => prev + 1);

      if (firstCard.pairId === secondCard.pairId) {
        setMatchedCards(prev => [...prev, firstId, secondId]);
        setFlippedCards([]);
      } else {
        const timer = setTimeout(() => {
          setFlippedCards([]);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [flippedCards, cards]);

  const handleFlip = (id) => {
    // Mulai timer pada klik pertama
    if (!isActive && matchedCards.length === 0) {
      setIsActive(true);
    }

    if (flippedCards.length < 2 && !flippedCards.includes(id) && !matchedCards.includes(id)) {
      setFlippedCards(prev => [...prev, id]);
    }
  };

  const resetGame = () => {
    setCards(createCards(difficulty));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setSeconds(0);
    setIsActive(false);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-white mb-4">Memory Card Game</h1>
      
      {/* Selector Difficulty */}
      <div className="flex gap-2 mb-6">
        {['easy', 'medium', 'hard'].map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${
              difficulty === level 
              ? 'bg-white text-indigo-900 shadow-lg scale-110' 
              : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>

      <ScoreBoard 
        moves={moves} 
        timer={formatTime(seconds)}
        matchedCount={matchedCards.length / 2} 
        totalPairs={DIFFICULTY_SETTINGS[difficulty].pairs} 
        onReset={resetGame} 
      />

      <GameBoard 
        cards={cards} 
        flippedCards={flippedCards} 
        matchedCards={matchedCards} 
        onFlip={handleFlip} 
      />
    </div>
  );
}