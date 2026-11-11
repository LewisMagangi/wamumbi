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
      className="fixed top-20 left-4 z-40 p-3 bg-card hover:bg-brand/10 rounded-xl shadow-lg hover:shadow-xl transition-all border border-border group"
      aria-label="Open navigation menu"
    >
      <Menu className="w-6 h-6 text-foreground/80 group-hover:text-brand transition-colors" />
    </button>
  );
}
