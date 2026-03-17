'use client';
import React, { useState, useEffect, useRef } from 'react';
import GameBoard from './components/GameBoard'; 
import ScoreBoard from './components/ScoreBoard';
import { FaAppleAlt, FaLemon, FaHeart, FaStar, FaGhost, FaIceCream, FaRocket, FaMoon } from 'react-icons/fa';

const Icons = [
  { icon: FaAppleAlt, color: '#FF6B6B' }, { icon: FaLemon, color: '#FFD93D' },
  { icon: FaHeart, color: '#FF6B6B' }, { icon: FaStar, color: '#FFD93D' },
  { icon: FaGhost, color: '#f8fafc' }, { icon: FaIceCream, color: '#fbbf24' },
  { icon: FaRocket, color: '#38bdf8' }, { icon: FaMoon, color: '#818cf8' },
];

const DIFFICULTY_SETTINGS = {
  easy: { pairs: 4, cols: 'grid-cols-4' },
  medium: { pairs: 6, cols: 'grid-cols-4' },
  hard: { pairs: 8, cols: 'grid-cols-4' },
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

  const shufflearray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const createCards = (level) => {
    const numPairs = DIFFICULTY_SETTINGS[level].pairs;
    const selectedIcons = Icons.slice(0, numPairs);
    const paired = selectedIcons.flatMap((item, index) => [
      { id: index * 2, icon: item.icon, color: item.color, pairId: index },
      { id: index * 2 + 1, icon: item.icon, color: item.color, pairId: index },
    ]);
    return shufflearray(paired);
  };

  useEffect(() => { resetGame(); }, [difficulty]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      setMoves(prev => prev + 1);
      if (firstCard.pairId === secondCard.pairId) {
        setMatchedCards(prev => [...prev, firstId, secondId]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 800);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedCards.length > 0 && matchedCards.length === DIFFICULTY_SETTINGS[difficulty].pairs * 2) {
      setIsActive(false);
    }
  }, [matchedCards, difficulty]);

  const handleFlip = (id) => {
    if (!isActive && matchedCards.length === 0) setIsActive(true);
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

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

return (
  <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center justify-center p-4">
    <div className="flex items-center gap-3 mb-8 animate-floating">
      <span className="text-4xl text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
        🃏
      </span>
      <h1 className="text-5xl font-black text-white tracking-tight italic drop-shadow-lg">
        Memory <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Card</span>
      </h1>
    </div>

      {/* Difficulty Tabs */}
      <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl gap-2 mb-8 border border-white/5">
        {Object.keys(DIFFICULTY_SETTINGS).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              difficulty === level ? 'bg-yellow-400 text-[#0f0c29] shadow-lg shadow-yellow-400/20' : 'text-gray-400 hover:text-white'
            }`}
          >
             {level === 'easy' && '😊'} {level === 'medium' && '😑'} {level === 'hard' && '☠️'}
             {level.charAt(0).toUpperCase() + level.slice(1)} ({DIFFICULTY_SETTINGS[level].pairs})
          </button>
        ))}
      </div>

      <ScoreBoard 
        moves={moves} timer={formatTime(seconds)} 
        matchedCount={matchedCards.length / 2} 
        totalPairs={DIFFICULTY_SETTINGS[difficulty].pairs} 
        onReset={resetGame} 
      />

      {/* Area Game dengan Container Transparan */}
      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl mt-8">
        <GameBoard 
          cards={cards} flippedCards={flippedCards} matchedCards={matchedCards} 
          onFlip={handleFlip} gridCols={DIFFICULTY_SETTINGS[difficulty].cols}
        />
      </div>
    </div>
  );
}