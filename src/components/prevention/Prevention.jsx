import React from 'react';
import { Microscope, ClipboardCheck, HeartHandshake, ShieldPlus } from 'lucide-react';
import QRCode from 'react-qr-code';

const steps = [
  {
    icon: Microscope,
    title: 'Step 1',
    desc: 'Get an HPLC blood test.'
  },
  {
    icon: ClipboardCheck,
    title: 'Step 2',
    desc: 'Know your status.'
  },
  {
    icon: HeartHandshake,
    title: 'Step 3',
    desc: 'Make an informed marriage choice.'
  },
  {
    icon: ShieldPlus,
    title: 'Step 4',
    desc: 'Protect your future children.'
  }
];

export default function Prevention() {
  return (
  <div className="max-w-5xl mx-auto px-4 py-14 space-y-14">
      <header className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-rose-600">Your Action Today Can <span className="block text-rose-700">Save Generations</span></h1>
        <p className="text-sm sm:text-base text-rose-700/80 max-w-3xl mx-auto leading-relaxed">
          Simple preventive steps dramatically reduce the incidence of severe inherited blood disorders. Follow this four‑step path and share it with your community.
        </p>
      </header>
      <section className="relative rounded-3xl bg-gradient-to-b from-rose-600 to-rose-700 p-[1px] shadow-lg">
        <div className="rounded-[calc(1.5rem-1px)] bg-white/95 backdrop-blur-sm p-8 sm:p-14 space-y-14">
          <ol className="relative border-l border-rose-200/70 pl-8 space-y-12">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="flex items-start gap-7 group">
                  <div className="absolute -left-[34px] flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center ring-4 ring-white shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {idx !== steps.length - 1 && <span className="flex-1 w-px bg-gradient-to-b from-rose-300/70 to-transparent mt-3" />}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-rose-700 text-lg tracking-tight">{s.title}</h3>
                    <p className="text-[15px] text-rose-700/80 mt-2 leading-relaxed max-w-prose">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="grid sm:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-rose-700 tracking-tight">Take the First Test</h2>
              <p className="text-[15px] text-rose-700/80 leading-relaxed">Early screening empowers informed life decisions. Encourage partners, friends and family to complete the same steps and build an unbroken prevention chain.</p>
              <p className="text-xs text-rose-500">Medical disclaimer: Always seek qualified medical professionals for personalized guidance.</p>
            </div>
            <button
              onClick={()=> window.open('https://linktr.ee/bloodwarriors','_blank','noopener,noreferrer')}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-rose-50 ring-1 ring-rose-100 p-8 hover:bg-rose-100/70 transition-colors group"
              aria-label="Open Blood Warriors resource link"
            >
              <div className="w-44 h-44 rounded-xl bg-white ring-1 ring-rose-200 flex items-center justify-center shadow-sm p-4">
                <QRCode
                  value="https://linktr.ee/bloodwarriors"
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#be123c" /* rose-700 */
                  className="group-hover:scale-[1.03] transition-transform"
                  level="Q"
                />
              </div>
              <span className="text-xs tracking-wide text-rose-600 font-medium">Scan or tap to explore resources</span>
            </button>
          </div>
        </div>
      </section>
      <footer className="text-center text-xs text-rose-500">
        For queries: <a href="tel:+919876543210" className="underline decoration-dotted hover:text-rose-600">+91 9876543210</a>
      </footer>
    </div>
  );
}
