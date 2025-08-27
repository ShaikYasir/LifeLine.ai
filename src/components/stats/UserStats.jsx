import React, { useMemo, useEffect, useState } from 'react';
import { Activity, Award, TrendingUp, Droplet, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper to format dates
function format(dateStr){
  if(!dateStr) return '—';
  try { const d = new Date(dateStr); if(!isNaN(d)) return d.toLocaleDateString(); } catch(e) {}
  return dateStr;
}

export default function UserStats({ donorData, currentUser }) {
  const donorProfile = currentUser?.unsafeMetadata?.donorProfile || currentUser?.publicMetadata?.donorProfile;
  const [lastProfileSync, setLastProfileSync] = useState(() => donorProfile ? new Date() : null);

  // Update sync timestamp whenever donorProfile object identity changes
  useEffect(()=>{ if(donorProfile) setLastProfileSync(new Date()); }, [donorProfile]);

  // Strict dataset match: ONLY if the donorProfile contains a unique id that exists in dataset.
  // This prevents showing another person's stats just because blood group or region matches.
  const { donorRecord, matched } = useMemo(()=> {
    if(!donorData?.donors || !donorProfile?.id) return { donorRecord: null, matched: false };
    const found = donorData.donors.find(d=> String(d.id) === String(donorProfile.id));
    return { donorRecord: found || null, matched: !!found };
  }, [donorData, donorProfile]);

  const derived = useMemo(()=> {
    if(!matched || !donorRecord) return null;
    const total = donorRecord.totalDonations || donorRecord.donations_till_date || 0;
    const last = donorRecord.lastDonation || donorRecord.last_donation_date || null;
    const firstYear = donorRecord.firstDonationYear && donorRecord.firstDonationYear !== 'N/A' ? donorRecord.firstDonationYear : null;
    const avgPerYear = firstYear ? (total / (new Date().getFullYear() - firstYear + 1)) : (total || 0);
    return { total, last, avgPerYear: avgPerYear.toFixed(1) };
  }, [matched, donorRecord]);

  return (
    <div className="p-6 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-primary-900 flex items-center gap-2"><Activity className="w-6 h-6 text-primary-600" /> Your Donation Stats</h1>
          <p className="text-sm text-primary-600">A human-friendly summary of your impact.</p>
        </div>
      </header>

      {/* Profile Snapshot Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-primary-700 flex items-center gap-2"><Droplet className="w-4 h-4" /> Your Profile Snapshot</h2>
        {!donorProfile && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg text-sm text-rose-700 flex flex-col gap-2">
            <span>No donor profile saved yet.</span>
            <Link to="/register-donor" className="inline-block text-rose-700 font-medium underline">Create your donor profile</Link>
          </div>
        )}
        {donorProfile && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white border border-primary-100 rounded-lg p-4 text-xs space-y-1">
              <div className="text-[11px] font-semibold text-primary-500">Blood Group</div>
              <div className="text-primary-900 text-sm font-medium">{donorProfile.bloodGroup || '—'}</div>
            </div>
            <div className="bg-white border border-primary-100 rounded-lg p-4 text-xs space-y-1">
              <div className="text-[11px] font-semibold text-primary-500">Region</div>
              <div className="text-primary-900 text-sm font-medium">{donorProfile.region || '—'}</div>
            </div>
            <div className="bg-white border border-primary-100 rounded-lg p-4 text-xs space-y-1">
              <div className="text-[11px] font-semibold text-primary-500">District</div>
              <div className="text-primary-900 text-sm font-medium">{donorProfile.district || '—'}</div>
            </div>
            <div className="bg-white border border-primary-100 rounded-lg p-4 text-xs space-y-1">
              <div className="text-[11px] font-semibold text-primary-500">Bridge Status</div>
              <div className="text-primary-900 text-sm font-medium">{donorProfile.joinBridge ? (donorProfile.joinBridgeId ? `Joined (${donorProfile.joinBridgeId})` : 'Opted In') : 'Not Joined'}</div>
            </div>
          </div>
        )}
        {lastProfileSync && <p className="text-[10px] text-primary-400">Profile last synced: {lastProfileSync.toLocaleTimeString()}</p>}
      </section>

      {!matched && donorProfile && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">Impact metrics will appear after your first verified donation record is linked.</div>
      )}

      {matched && donorRecord && derived && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary-700 font-semibold text-sm"><Droplet className="w-4 h-4" /> Core Profile</div>
            <ul className="text-xs text-primary-600 space-y-1">
              <li><span className="font-medium text-primary-900">Name:</span> {donorRecord.name}</li>
              <li><span className="font-medium text-primary-900">Blood Group:</span> {donorRecord.bloodGroup || '—'}</li>
              <li><span className="font-medium text-primary-900">Bridge:</span> {donorRecord.bridgeId || 'None'}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary-700 font-semibold text-sm"><TrendingUp className="w-4 h-4" /> Impact Summary</div>
            <ul className="text-xs text-primary-600 space-y-1">
              <li><span className="font-medium text-primary-900">Total Donations:</span> {derived.total}</li>
              <li><span className="font-medium text-primary-900">Avg / Year:</span> {derived.avgPerYear}</li>
              <li><span className="font-medium text-primary-900">Last Donation:</span> {format(derived.last)}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary-700 font-semibold text-sm"><Award className="w-4 h-4" /> Recognition</div>
            <p className="text-xs text-primary-600 leading-relaxed">You're part of a life‑saving network. Keep healthy intervals (typically 56–90 days depending on regulations). Consistency improves match reliability.</p>
            <div className="mt-auto text-[10px] text-primary-400">Model insights coming soon.</div>
          </div>
        </div>
      )}

      {matched && donorRecord && derived && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-primary-700 flex items-center gap-2"><Calendar className="w-4 h-4" /> Personalized Notes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-primary-100 bg-white p-4 text-xs text-primary-600">
              <p><strong className="text-primary-900">Donation Cadence:</strong> {derived.total > 0 ? `You have donated ${derived.total} time${derived.total>1?'s':''}. Stay hydrated and plan your next safe window.` : 'No recorded donations yet—your first will create a lasting mark.'}</p>
            </div>
            <div className="rounded-lg border border-primary-100 bg-white p-4 text-xs text-primary-600">
              <p><strong className="text-primary-900">Bridge Participation:</strong> {donorProfile?.joinBridgeId ? `Joined bridge ${donorProfile.joinBridgeId}.` : (donorProfile?.joinBridge ? 'Opted into joining a bridge.' : 'Not part of any bridge yet.')}</p>
            </div>
          </div>
        </section>
      )}

      <footer className="pt-4 text-[10px] text-primary-400 flex items-center gap-2">
      </footer>
    </div>
  );
}
