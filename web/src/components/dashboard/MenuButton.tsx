'use client';
import React from 'react';
import { Menu } from 'lucide-react';

interface MenuButtonProps {
  onClick: () => void;
}

export default function MenuButton({ onClick }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-20 left-4 z-40 p-3 bg-white hover:bg-rose-50 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 group"
      aria-label="Open navigation menu"
    >
      <Menu className="w-6 h-6 text-gray-700 group-hover:text-rose-500 transition-colors" />
    </button>
  );
}
