import React, { useMemo } from 'react';
import { Trophy, Award, HeartHandshake, Medal, Flame, Users } from 'lucide-react';
import { formatDate } from '../../lib/utils.js';

// Simple badge style helper (static class mappings for Tailwind safelist friendliness)
const badgeColorClasses = {
  primary: 'bg-primary-50 text-primary-700 border-primary-100',
  red: 'bg-red-50 text-red-700 border-red-100',
};
const Badge = ({ children, color='primary' }) => {
  const cls = badgeColorClasses[color] || badgeColorClasses.primary;
  return <span className={`inline-block text-xs px-2 py-1 rounded-full border ${cls}`}>{children}</span>;
};

// Derive award categories
function computeAwards(donors) {
  if (!Array.isArray(donors) || !donors.length) return { lists: {}, meta: { total: 0 } };

  const byDonations = [...donors].sort((a,b)=> (b.totalDonations||0) - (a.totalDonations||0));
  const topDonors = byDonations.slice(0,10);

  // Emergency responders (role contains 'emergency') ordered by total donations desc
  const emergency = donors.filter(d=> (d.role||'').toLowerCase().includes('emergency'))
    .sort((a,b)=> (b.totalDonations||0) - (a.totalDonations||0));

  // Consistency: donors with >=4 donations and average gap <= 120 days (approx by lastDonation vs count)
  const now = new Date();
  const consistent = donors.filter(d=> {
    const count = d.totalDonations||0;
    if (count < 4) return false;
    const last = d.lastDonation ? parseDateString(d.lastDonation) : null;
    if (!last) return false;
    const spanDays = Math.max(1,(now - last)/(86400000)); // days since last donation
    const avgGap = spanDays / count; // simplistic proxy
    return avgGap <= 120; // roughly quarterly or faster
  }).sort((a,b)=> (b.totalDonations||0) - (a.totalDonations||0));

  // Blood siblings: group donors by bloodGroup and pick top 2 as 'Brother'/'Sister' per group
  const bloodGroups = {};
  donors.forEach(d=> { if(d.bloodGroup && d.bloodGroup !== 'N/A'){ (bloodGroups[d.bloodGroup] ||= []).push(d);} });
  const siblings = [];
  Object.entries(bloodGroups).forEach(([bg,list])=>{
    list.sort((a,b)=> (b.totalDonations||0) - (a.totalDonations||0));
    if (list[0]) siblings.push({ type: 'Blood Brother', bloodGroup: bg, donor: list[0] });
    if (list[1]) siblings.push({ type: 'Blood Sister', bloodGroup: bg, donor: list[1] });
  });

  return {
    lists: { topDonors, emergency, consistent, siblings },
    meta: { total: donors.length }
  };
}

function parseDateString(str){
  if(!str) return null; const [d,m,y] = str.split('-').map(n=>parseInt(n,10)); if(!d||!m||!y) return null; return new Date(y,m-1,d);
}

export default function Rewards({ donorData }) {
  const awards = useMemo(()=> {
    const donors = donorData?.donors || [];
    return computeAwards(donors);
  }, [donorData]);

  return (
    <div className="p-6 space-y-10">
      <header className="flex items-center gap-3">
        <Trophy className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-semibold text-primary-900">Donor Rewards & Recognition</h1>
          <p className="text-primary-600 text-sm">Celebrating outstanding contributions from {awards.meta.total} donors.</p>
        </div>
      </header>

      {/* Top Donors */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2 text-primary-900"><Award className="w-5 h-5" /> Top Donors</h2>
        <p className="text-sm text-primary-600 mb-4">Highest cumulative donations.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.lists.topDonors.map((d,i)=>(
            <div key={d.id} className="bg-white p-4 rounded-xl border border-primary-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-primary-900">#{i+1} {d.name}</h3>
                  <p className="text-xs text-primary-500">{d.bridgeId}</p>
                </div>
                <Badge>{d.bloodGroup}</Badge>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-primary-600">Total</span>
                <span className="font-semibold text-primary-900">{d.totalDonations}</span>
              </div>
              <div className="mt-1 flex justify-between text-xs text-primary-500">
                <span>Last</span>
                <span>{formatDate(d.lastDonation)||'—'}</span>
              </div>
            </div>
          ))}
          {!awards.lists.topDonors.length && <p className="text-sm text-primary-500">No donors yet.</p>}
        </div>
      </section>

      {/* Emergency Responders */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2 text-primary-900"><Flame className="w-5 h-5" /> Emergency Responders</h2>
        <p className="text-sm text-primary-600 mb-4">Recognizing donors flagged for emergency roles.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.lists.emergency.slice(0,9).map(d=>(
            <div key={d.id} className="bg-white p-4 rounded-xl border border-primary-100">
              <h3 className="font-medium text-primary-900 flex justify-between"><span>{d.name}</span><Badge color="red">Emergency</Badge></h3>
              <p className="text-xs text-primary-500 mb-2">{d.bridgeId}</p>
              <p className="text-xs text-primary-600">Donations: <span className="font-semibold">{d.totalDonations}</span></p>
            </div>
          ))}
          {!awards.lists.emergency.length && <p className="text-sm text-primary-500">No emergency donors recorded.</p>}
        </div>
      </section>

      {/* Consistency Champions */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2 text-primary-900"><Medal className="w-5 h-5" /> Consistency Champions</h2>
        <p className="text-sm text-primary-600 mb-4">Regular donors with sustained contribution cadence.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.lists.consistent.slice(0,9).map(d=>(
            <div key={d.id} className="bg-white p-4 rounded-xl border border-primary-100">
              <h3 className="font-medium text-primary-900">{d.name}</h3>
              <p className="text-xs text-primary-500 mb-2">{d.bridgeId}</p>
              <div className="text-xs text-primary-600 flex justify-between"><span>Donations</span><span className="font-semibold">{d.totalDonations}</span></div>
              <div className="text-xs text-primary-600 flex justify-between"><span>Last</span><span>{formatDate(d.lastDonation)||'—'}</span></div>
            </div>
          ))}
          {!awards.lists.consistent.length && <p className="text-sm text-primary-500">No consistent donors identified.</p>}
        </div>
      </section>

      {/* Blood Siblings */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2 text-primary-900"><HeartHandshake className="w-5 h-5" /> Blood Siblings</h2>
        <p className="text-sm text-primary-600 mb-4">Top contributors per blood bridge.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.lists.siblings.map((s,i)=>(
            <div key={i} className="bg-white p-4 rounded-xl border border-primary-100">
              <h3 className="font-medium text-primary-900 flex justify-between"><span>{s.type}</span><Badge>{s.bloodGroup}</Badge></h3>
              <p className="text-sm text-primary-700 mt-2">{s.donor.name}</p>
              <p className="text-xs text-primary-500 mb-1">{s.donor.bridgeId}</p>
              <p className="text-xs text-primary-600">Donations: <span className="font-semibold">{s.donor.totalDonations}</span></p>
            </div>
          ))}
          {!awards.lists.siblings.length && <p className="text-sm text-primary-500">Not enough data.</p>}
        </div>
      </section>

      <footer className="pt-4 text-xs text-primary-500">
       
      </footer>
    </div>
  );
}