import React from 'react';
import { FaClock, FaMousePointer, FaCheck, FaSyncAlt } from 'react-icons/fa';

export default function ScoreBoard({ moves, matchedCount, totalPairs, onReset, timer }) {
  return (
    <div className="w-full max-w-xl flex flex-col items-center">
      {/* Container Panel Statistik */}
      <div className="grid grid-cols-3 gap-3 w-full mb-6">
        <StatBox label="WAKTU" value={timer} icon={<FaClock className="text-indigo-400" />} />
        <StatBox label="PERCOBAAN" value={moves} icon={<FaMousePointer className="text-indigo-400" />} />
        <StatBox label="DITEMUKAN" value={`${matchedCount}/${totalPairs}`} icon={<FaCheck className="text-indigo-400" />} />
      </div>

      {/* Tombol Acak Ulang - Berdiri Sendiri */}
      <button
        onClick={onReset}
        className="px-10 py-3 bg-yellow-400 text-[#0f0c29] font-extrabold rounded-full flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.4)] uppercase text-sm tracking-wider"
      >
        <FaSyncAlt /> Acak Ulang
      </button>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="bg-[#2a2a4a]/60 backdrop-blur-md border border-white/10 p-5 rounded-[2rem] text-center flex flex-col items-center justify-center min-h-[110px]">
      <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2 mb-2 tracking-[0.2em]">
        {icon} {label}
      </p>
      <p className="text-3xl font-bold text-white tabular-nums tracking-tight">{value}</p>
    </div>
  );
}