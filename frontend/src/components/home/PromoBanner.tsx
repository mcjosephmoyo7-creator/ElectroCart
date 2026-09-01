'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { FaFire } from 'react-icons/fa';

function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, targetMs - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(Math.max(0, targetMs - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetMs]);

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
}

export default function PromoBanner() {
  const { hours, minutes, seconds } = useCountdown(Date.now() + 1000 * 60 * 60 * 24 * 2);

  const units = [
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
    { value: seconds, label: 'Seconds' },
  ];

  return (
    <section className="container-custom py-12 lg:py-16">
      <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-r from-accent-600 via-accent to-navy-300 px-6 py-12 lg:px-16 lg:py-16">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-40 h-40 rounded-full bg-navy-900/30 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest rounded-full px-4 py-1.5">
              <FaFire className="w-3.5 h-3.5 text-accent" /> Limited Time Offer
            </span>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-white leading-tight">
              Get up to 30% off on <span className="text-navy-900">Washing Machines</span> &{' '}
              <span className="text-navy-900">Refrigerators</span>
            </h2>
            <p className="mt-3 text-white/80 max-w-lg">
              Refresh your home with powerful, energy-efficient appliances at the season&apos;s best prices.
            </p>

            {/* Countdown */}
            <div className="mt-7 flex items-center gap-3">
              {units.map((unit) => (
                <div key={unit.label} className="flex items-center gap-3">
                  <div className="bg-white text-navy rounded-xl w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold tabular-nums">{unit.value}</span>
                    <span className="text-[10px] font-semibold text-muted uppercase">{unit.label}</span>
                  </div>
                  {unit.label !== 'Seconds' && <span className="text-white text-2xl font-bold">:</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:text-center">
            <Link
              href="/shop?category=washing-machine"
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-50 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all hover:scale-105"
            >
              Grab the Deal <HiOutlineLightningBolt className="w-5 h-5 inline-block text-accent" />
            </Link>
            <p className="mt-3 text-white/70 text-xs">Ends in 02:{minutes}:{seconds} · While stocks last</p>
          </div>
        </div>
      </div>
    </section>
  );
}