import React from 'react';
import { Droplet, HeartPulse } from 'lucide-react';

/**
 * Centered blood-donation themed loading screen.
 * Shows animated droplets and an accessible status message.
 */
export default function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 via-white to-rose-100 text-primary-800 relative overflow-hidden">
      {/* Subtle background circles */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply blur-3xl" />
      </div>

      {/* Droplet animation cluster */}
      <div className="relative flex items-center justify-center mb-8" aria-hidden="true">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-full border-4 border-rose-200 animate-ping" />
          <div className="absolute inset-6 rounded-full border-2 border-rose-300 animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-12 rounded-full bg-rose-500/10 backdrop-blur-sm flex items-center justify-center">
            <Droplet className="w-14 h-14 text-rose-600 animate-bounce drop-shadow" />
          </div>
          {/* orbiting small droplets */}
          <Droplet className="w-5 h-5 text-rose-500 absolute -top-2 left-1/2 -translate-x-1/2 animate-[bounce_2.4s_infinite_0.2s]" />
          <Droplet className="w-5 h-5 text-rose-400 absolute top-1/2 -right-2 -translate-y-1/2 animate-[bounce_2.4s_infinite_0.8s]" />
          <Droplet className="w-5 h-5 text-rose-300 absolute -bottom-1 left-1/3 animate-[bounce_2.4s_infinite_1.3s]" />
        </div>
      </div>

      <div className="space-y-3 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-rose-700 flex items-center justify-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
          Preparing Your Lifeline
        </h1>
        <p className="text-sm text-rose-600 max-w-xs mx-auto leading-relaxed">
          Matching donors, bridges, and emergency readiness. Please hold on a moment.
        </p>
        <div className="flex items-center justify-center gap-2 pt-2" role="status" aria-live="polite">
          <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.4s]" />
          <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
          <span className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" />
          <span className="sr-only">Loading</span>
        </div>
      </div>

      <p className="mt-10 text-[10px] uppercase tracking-widest text-rose-400 font-medium">Blood Connect Platform</p>
    </div>
  );
}
