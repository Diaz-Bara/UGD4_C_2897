'use client';

import React, { useState, useEffect, useRef } from 'react';
import GameBoard from './components/GameBoard'; 
import ScoreBoard from './components/ScoreBoard';

// Import Icon
import { 
  FaAppleAlt, FaLemon, FaHeart, FaStar, 
  FaGhost, FaIceCream, FaRocket, FaMoon 
} from 'react-icons/fa';

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

  // RESET GAME: Timer fiks langsung jalan tiap kali panggil reset
  const resetGame = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    setCards(createCards(difficulty));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setSeconds(0);

    // Kasih jeda 10ms biar React re-trigger state isActive
    setTimeout(() => {
      setIsActive(true);
    }, 10);
  };

  // Efek saat ganti level
  useEffect(() => {
    resetGame();
  }, [difficulty]);

  // Logika Detak Timer
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

  // Cek Match
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

  // Stop Timer kalau menang
  useEffect(() => {
    const currentPairs = DIFFICULTY_SETTINGS[difficulty].pairs;
    if (matchedCards.length > 0 && matchedCards.length === currentPairs * 2) {
      setIsActive(false);
    }
  }, [matchedCards, difficulty]);

  const handleFlip = (id) => {
    if (flippedCards.length < 2 && !flippedCards.includes(id) && !matchedCards.includes(id)) {
      setFlippedCards(prev => [...prev, id]);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-b from-[#0f0c29] via-[#1a1a3a] to-[#0f0c29] flex flex-col items-center justify-center p-4 font-sans antialiased">
      
      {/* JUDUL: pr-10 agar huruf 's' aman, animate-floating agar melayang */}
      <div className="flex items-center justify-center gap-4 mb-8 animate-floating w-full pr-4">
        <div className="bg-white/10 p-2.5 rounded-xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <span className="text-3xl text-yellow-400">🃏</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic drop-shadow-2xl pr-10">
          Memory <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300">Cards</span>
        </h1>
      </div>

      {/* DIFFICULTY TABS */}
      <div className="flex bg-[#1a1a3a]/90 backdrop-blur-xl p-1.5 rounded-full gap-2 mb-2 border border-white/10 shadow-2xl">
        {Object.keys(DIFFICULTY_SETTINGS).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-7 py-2.5 rounded-full text-[11px] font-black flex items-center gap-2 transition-all duration-300 uppercase tracking-widest ${
              difficulty === level 
              ? 'bg-yellow-400 text-[#0f0c29] shadow-lg shadow-yellow-400/40 scale-105' 
              : 'text-gray-400 hover:text-white'
            }`}
          >
             {level === 'easy' && '😊'} {level === 'medium' && '😑'} {level === 'hard' && '☠️'}
             {level} ({DIFFICULTY_SETTINGS[level].pairs})
          </button>
        ))}
      </div>

      {/* IDENTITAS GAME DIAZ BARA */}
      <p className="mb-10 text-yellow-400/70 font-black italic uppercase tracking-[0.5em] text-[10px] animate-pulse">
        Game Diaz Bara
      </p>

      {/* SCOREBOARD (Waktu, Klik, Progress) & Tombol Acak Ulang */}
      <ScoreBoard 
        moves={moves} 
        timer={formatTime(seconds)} 
        matchedCount={matchedCards.length / 2} 
        totalPairs={DIFFICULTY_SETTINGS[difficulty].pairs} 
        onReset={resetGame} 
      />

      {/* WADAH KARTU */}
      <div className="bg-white/5 backdrop-blur-md p-10 rounded-[50px] border border-white/10 shadow-2xl mt-12 w-full max-w-2xl flex justify-center">
        <GameBoard 
          cards={cards} 
          flippedCards={flippedCards} 
          matchedCards={matchedCards} 
          onFlip={handleFlip} 
          gridCols={DIFFICULTY_SETTINGS[difficulty].cols}
        />
      </div>

      <p className="mt-12 text-indigo-400/20 text-[9px] font-bold tracking-[0.7em] uppercase">
        UAJY • Information Systems
      </p>

    </div>
  );
}