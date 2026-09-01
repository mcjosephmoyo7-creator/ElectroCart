'use client';

import { useCallback } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

export default function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const gap = 1;

  const setLower = useCallback(
    (raw: string) => {
      const next = Math.min(Math.max(Number(raw) || min, min), value[1] - gap);
      onChange([next, value[1]]);
    },
    [min, value, onChange, gap]
  );

  const setUpper = useCallback(
    (raw: string) => {
      const next = Math.max(Math.min(Number(raw) || max, max), value[0] + gap);
      onChange([value[0], next]);
    },
    [max, value, onChange, gap]
  );

  const lowerPct = ((value[0] - min) / (max - min)) * 100;
  const upperPct = ((value[1] - min) / (max - min)) * 100;

  return (
    <div>
      <div className="relative h-1.5 rounded-full bg-lineBorder mt-6 mb-2">
        <div
          className="absolute h-1.5 rounded-full bg-primary"
          style={{ left: `${lowerPct}%`, right: `${100 - upperPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          aria-label="Minimum price"
          onChange={(e) => setLower(e.target.value)}
          className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-navy [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer"
          style={{ left: 0 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          aria-label="Maximum price"
          onChange={(e) => setUpper(e.target.value)}
          className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-navy [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer"
          style={{ left: 0 }}
        />
      </div>
      <div className="flex items-center justify-between text-sm mt-4">
        <label className="flex-1 flex items-center gap-1.5 bg-body dark:bg-navy-50 border border-lineBorder dark:border-navy-100 rounded-lg px-2 py-1.5">
          <span className="text-muted">$</span>
          <input
            type="number"
            min={min}
            max={max}
            value={value[0]}
            onChange={(e) => setLower(e.target.value)}
            className="w-full bg-transparent text-slateText dark:text-white text-sm outline-none"
          />
        </label>
        <span className="mx-2 text-muted">—</span>
        <label className="flex-1 flex items-center gap-1.5 bg-body dark:bg-navy-50 border border-lineBorder dark:border-navy-100 rounded-lg px-2 py-1.5">
          <span className="text-muted">$</span>
          <input
            type="number"
            min={min}
            max={max}
            value={value[1]}
            onChange={(e) => setUpper(e.target.value)}
            className="w-full bg-transparent text-slateText dark:text-white text-sm outline-none"
          />
        </label>
      </div>
    </div>
  );
}