import React from 'react';
import { FaClock, FaMousePointer, FaCheck, FaSyncAlt, FaRedo } from 'react-icons/fa';

function ScoreBoard({ moves, matchedCount, totalPairs, onReset, timer }) {
  const isGameComplete = matchedCount === totalPairs;

  return (
    <div className="text-center mb-6">
      <div className="flex justify-center gap-4 mb-4">
        {/* Timer Box */}
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg min-w-[100px]">
          <p className="text-sm text-indigo-200 flex items-center justify-center gap-1">
            <FaClock className="text-indigo-300" /> Waktu
          </p>
          <p className="text-2xl font-bold text-white font-mono">{timer}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg min-w-[100px]">
          <p className="text-sm text-indigo-200 flex items-center justify-center gap-1">
            <FaMousePointer className="text-indigo-300" /> Klik
          </p>
          <p className="text-2xl font-bold text-white">{moves}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg min-w-[100px]">
          <p className="text-sm text-indigo-200 flex items-center justify-center gap-1">
            <FaCheck className="text-indigo-300" /> Progres
          </p>
          <p className="text-2xl font-bold text-white">{matchedCount}/{totalPairs}</p>
        </div>
      </div>

      {isGameComplete && (
        <div className="mb-4">
           <p className="text-yellow-300 font-bold text-xl animate-pulse">
            🎉 Luar Biasa!
          </p>
          <p className="text-white text-sm">Selesai dalam {timer} dengan {moves} klik.</p>
        </div>
      )}

      <button
        onClick={onReset}
        className="px-6 py-2 bg-yellow-400 text-indigo-900 font-bold rounded-full hover:bg-yellow-300 transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto active:scale-95"
      >
        {isGameComplete ? <FaRedo /> : <FaSyncAlt />}
        {isGameComplete ? 'Main Lagi' : 'Reset Game'}
      </button>
    </div>
  );
}

export default ScoreBoard;