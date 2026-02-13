
import React from 'react';

export const INITIAL_BALANCE = 10000;

export const VIP_LEVELS = [
  { level: 1, expNeeded: 0, label: 'Bronze' },
  { level: 2, expNeeded: 10000, label: 'Silver' },
  { level: 3, expNeeded: 50000, label: 'Gold' },
  { level: 4, expNeeded: 200000, label: 'Platinum' },
  { level: 5, expNeeded: 500000, label: 'Diamond' },
  { level: 6, expNeeded: 1000000, label: 'Master' },
  { level: 7, expNeeded: 5000000, label: 'Elite' },
  { level: 8, expNeeded: 10000000, label: 'Legend' },
  { level: 9, expNeeded: 50000000, label: 'Mythic' },
  { level: 10, expNeeded: 100000000, label: 'Immortal' },
];

export const COLOR_CONFIG = {
  RED: { bg: 'bg-red-600', shadow: 'shadow-red-500/50', label: 'Red' },
  GREEN: { bg: 'bg-green-600', shadow: 'shadow-green-500/50', label: 'Green' },
  VIOLET: { bg: 'bg-purple-600', shadow: 'shadow-purple-500/50', label: 'Violet' }
};

export const COLORS_BY_NUMBER: Record<number, string[]> = {
  0: ['RED', 'VIOLET'], 1: ['GREEN'], 2: ['RED'], 3: ['GREEN'], 4: ['RED'],
  5: ['GREEN', 'VIOLET'], 6: ['RED'], 7: ['GREEN'], 8: ['RED'], 9: ['GREEN']
};
