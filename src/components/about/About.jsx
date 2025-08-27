import React from 'react'
import { SignedOut, SignInButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import AutoCarousel from '../common/AutoCarousel'
import logo from '../../assets/logo.png'
import smallLogo from '../../assets/logo_s.png'
import logoSvg from '../../assets/logo.svg'
import reactLogo from '../../assets/react.svg'
import thal1 from '../../assets/thalassemia-1.0ecbf633.svg'
import thal2 from '../../assets/thalassemia-2.117275b6.svg'
import thal3 from '../../assets/thalassemia-3.8a64b298.svg'

export default function About() {
  return (
    <div className="relative max-w-5xl mx-auto px-4 py-10 space-y-12">
      {/* Background carousel behind hero */}
      <div className="absolute inset-x-0 top-0 h-64 sm:h-72 md:h-80 -z-10 overflow-hidden rounded-2xl opacity-10 pointer-events-none select-none">
        <AutoCarousel
          interval={4200}
          images={[
            { src: logo, alt: 'LifeLine main logo' },
            { src: smallLogo, alt: 'LifeLine compact mark' },
            { src: logoSvg, alt: 'LifeLine vector' },
            { src: reactLogo, alt: 'React framework' }
          ]}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white" />
      </div>
      <section className="text-center space-y-4 relative">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-rose-700 text-transparent bg-clip-text">About LifeLine.ai</h1>
        <p className="text-rose-700/80 max-w-2xl mx-auto leading-relaxed">
          Inspired by community-driven blood donation initiatives, LifeLine.ai aims to make blood availability
          transparent, timely and data-informed. We analyze donor patterns, emergencies and reward consistent donors
          so that every critical request meets a quick, lifesaving response.
        </p>
      </section>
      {/* Removed foreground carousel; background only */}

  <section className="grid md:grid-cols-3 gap-6 mt-6">
        {[
          { title: 'Mission', body: 'Bridge the gap between urgent need and available blood units through actionable intelligence.' },
          { title: 'Vision', body: 'A resilient, always-on donor ecosystem where no request is delayed for want of the right blood type.' },
          { title: 'Values', body: 'Transparency, empathy, reliability and continuous improvement guided by real data.' }
        ].map(card => (
          <div key={card.title} className="rounded-xl p-5 bg-rose-50 ring-1 ring-rose-100/70 shadow-sm hover:shadow transition">
            <h3 className="font-semibold text-rose-700 mb-2">{card.title}</h3>
            <p className="text-sm text-rose-700/80 leading-relaxed">{card.body}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-rose-700">Why It Matters</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-white ring-1 ring-rose-100 shadow-sm space-y-3">
            <h3 className="font-medium text-rose-600">Challenges Today</h3>
            <ul className="list-disc list-inside text-sm text-rose-700/80 space-y-1">
              <li>Fragmented donor data & delayed coordination</li>
              <li>Lack of predictive insight for upcoming shortages</li>
              <li>Limited retention incentives for repeat donors</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl bg-white ring-1 ring-rose-100 shadow-sm space-y-3">
            <h3 className="font-medium text-rose-600">Our Approach</h3>
            <ul className="list-disc list-inside text-sm text-rose-700/80 space-y-1">
              <li>Centralized, cleaned donor & emergency datasets</li>
              <li>Real-time clustering of emergency hotspots</li>
              <li>Recognition & rewards for consistency</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-rose-700">Impact Highlights</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { metric: '1200+', label: 'Active Donors Tracked' },
            { metric: '95%', label: 'Fulfilment Rate (Pilot Regions)' },
            { metric: '30%', label: 'Faster Match Turnaround' }
          ].map(s => (
            <div key={s.label} className="rounded-lg bg-rose-600/90 text-white p-4 flex flex-col items-center shadow">
              <span className="text-2xl font-bold">{s.metric}</span>
              <span className="text-xs tracking-wide uppercase opacity-90 mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold text-rose-700">What is Thalassemia?</h2>
          <p className="text-sm text-rose-700/80 max-w-3xl mx-auto leading-relaxed">
            An inherited blood disorder where the body cannot produce adequate healthy red blood cells or hemoglobin. Lifelong, timely transfusions and chelation therapy are vital for survival and quality of life.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[{
            img: thal1,
            alt: 'Genetic inheritance illustration',
            title: 'Genetic Origin',
            desc: 'A child inherits defective globin genes leading to Thalassemia Major.'
          }, {
            img: thal2,
            alt: 'Treatment dependency illustration',
            title: 'Need for Care',
            desc: 'Without consistent medical support the condition can become life‑threatening early.'
          }, {
            img: thal3,
            alt: 'Low hemoglobin impact illustration',
            title: 'Low Hemoglobin',
            desc: 'Insufficient hemoglobin limits oxygen delivery across organs causing chronic fatigue & complications.'
          }].map(card => (
            <div key={card.title} className="group relative overflow-hidden rounded-xl bg-white ring-1 ring-rose-100 shadow-sm hover:shadow transition p-5 flex flex-col">
              <div className="aspect-[4/3] w-full flex items-center justify-center mb-4">
                <img src={card.img} alt={card.alt} className="max-h-full max-w-full object-contain select-none pointer-events-none" />
              </div>
              <h3 className="text-sm font-semibold text-rose-700 mb-1">{card.title}</h3>
              <p className="text-xs text-rose-700/80 leading-relaxed flex-1">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-rose-700">How You Can Help</h2>
        <p className="text-sm text-rose-700/80 leading-relaxed max-w-3xl">
          Become a registered donor, keep your availability up to date, respond quickly to urgent calls and advocate
          for data transparency in your local blood banks. Together we can turn minutes saved into lives saved.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link to="/register-donor" className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 transition inline-block">Register Interest</Link>
        </div>
      </section>
    </div>
  )
}
