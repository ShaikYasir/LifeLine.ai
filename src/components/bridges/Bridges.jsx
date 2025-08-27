import React, { useMemo, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

// Expect prop donorData with donors array from App (processed dataset)
export default function Bridges({ donorData }) {
  const { user, isSignedIn } = useUser();
  const [search, setSearch] = useState('');

  const currentUserBridgeJoined = user?.unsafeMetadata?.donorProfile?.joinBridge === true;
  const joinedBridgeId = user?.unsafeMetadata?.donorProfile?.joinBridgeId;
  const currentUserBlood = user?.unsafeMetadata?.donorProfile?.bloodGroup || user?.publicMetadata?.donorProfile?.bloodGroup;

  const bridges = useMemo(() => {
    if (!donorData?.donors) return [];
    const parse = (d) => {
      if (!d) return 0;
      const parts = d.split('-');
      if (parts.length !== 3) return 0;
      const [dd, mm, yyyy] = parts.map(p => parseInt(p, 10));
      if (!dd || !mm || !yyyy) return 0;
      return new Date(yyyy, mm - 1, dd).getTime();
    };
    return donorData.donors
      .filter(d => d.isBridge)
      .sort((a,b) => parse(b.lastDonation) - parse(a.lastDonation))
      .slice(0,50);
  }, [donorData]);

  const joinedBridge = useMemo(() => {
    if (!joinedBridgeId) return null;
    return bridges.find(b => b.bridgeId === joinedBridgeId) || null;
  }, [joinedBridgeId, bridges]);

  const filtered = bridges.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      (b.bloodGroup || '').toLowerCase().includes(q) ||
      (b.bridgeId || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-rose-700">Bridges Network</h1>
        <p className="text-sm text-rose-700/80 max-w-2xl">Bridge donors coordinate and stabilize supply during predictable or emerging shortages. Join a bridge to contribute to structured, high-impact donation cycles.</p>
      </header>
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, blood group, bridge ID"
          className="w-72 max-w-full px-3 py-2 text-sm rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
        />
        {isSignedIn && (
          <div className="flex items-center gap-3">
            <div className="text-xs px-3 py-1 rounded-full bg-rose-100 text-rose-600 font-medium">
              {currentUserBridgeJoined ? 'You are part of a bridge.' : 'You have not joined a bridge yet.'}
            </div>
          </div>
        )}
      </div>
      {currentUserBridgeJoined && (
        <div className="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-rose-700">Your Bridge</h2>
              {joinedBridge ? (
                <p className="text-xs text-rose-600/80 mt-0.5">You are currently aligned with bridge <span className="font-medium text-rose-700">{joinedBridge.bridgeId}</span>.</p>
              ) : (
                <p className="text-xs text-rose-600/80 mt-0.5">You are in a bridge, but its record isn't in the top 50 recent list.</p>
              )}
            </div>
            <button
              onClick={() => {
                const profile = user?.unsafeMetadata?.donorProfile || user?.publicMetadata?.donorProfile || {};
                user?.update?.({ unsafeMetadata: { ...user.unsafeMetadata, donorProfile: { ...profile, joinBridge: false, joinBridgeId: null, joinedBridgeAt: null }}})
              }}
              className="text-xs px-3 py-1 rounded-md bg-white border border-rose-300 text-rose-600 hover:bg-rose-50"
            >Leave</button>
          </div>
          {joinedBridge && (
            <div className="grid sm:grid-cols-5 gap-3 text-xs">
              <InfoStat label="Bridge ID" value={joinedBridge.bridgeId} />
              <InfoStat label="Name" value={joinedBridge.name} />
              <InfoStat label="Blood Group" value={joinedBridge.bloodGroup} />
              <InfoStat label="Last Donation" value={joinedBridge.lastDonation || '—'} />
              <InfoStat label="Total Donations" value={joinedBridge.totalDonations || 0} />
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl ring-1 ring-rose-100 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-rose-50/70 text-rose-700">
            <tr className="text-left">
              <th className="py-2 px-3 font-medium">Bridge ID</th>
              <th className="py-2 px-3 font-medium">Name</th>
              <th className="py-2 px-3 font-medium">Blood Group</th>
              <th className="py-2 px-3 font-medium">Last Donation</th>
              <th className="py-2 px-3 font-medium">Total Donations</th>
              <th className="py-2 px-3 font-medium">Status</th>
              <th className="py-2 px-3 font-medium">Action</th>
            </tr>
          </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 px-3 text-center text-rose-500">No bridges match your search.</td>
                </tr>
              )}
              {filtered.map(b => {
                const canJoin = isSignedIn && !currentUserBridgeJoined && currentUserBlood && b.bloodGroup === currentUserBlood;
                return (
                  <tr key={b.bridgeId} className="border-t border-rose-100/70 hover:bg-rose-50/40">
                    <td className="py-2 px-3 font-mono text-xs text-rose-600">{b.bridgeId}</td>
                    <td className="py-2 px-3 text-rose-700">
                      <Link to={`/donors/${b.id}`} className="hover:underline">{b.name}</Link>
                    </td>
                    <td className="py-2 px-3">{b.bloodGroup}</td>
                    <td className="py-2 px-3">{b.lastDonation || '—'}</td>
                    <td className="py-2 px-3">{b.totalDonations || 0}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${b.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{b.status}</span>
                    </td>
                    <td className="py-2 px-3">
                      {canJoin ? (
                        <button
                          onClick={() => {
                            const profile = user?.unsafeMetadata?.donorProfile || user?.publicMetadata?.donorProfile || {};
                            user?.update?.({ unsafeMetadata: { ...user.unsafeMetadata, donorProfile: { ...profile, joinBridge: true, joinBridgeId: b.bridgeId, joinedBridgeAt: new Date().toISOString() }}})
                          }}
                          className="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium"
                        >Join</button>
                      ) : currentUserBridgeJoined ? (
                        <span className={`text-xs ${b.bridgeId === joinedBridgeId ? 'text-rose-600 font-medium' : 'text-rose-300'}`}>{b.bridgeId === joinedBridgeId ? 'Your Bridge' : '—'}</span>
                      ) : (
                        <span className="text-xs text-rose-400">{isSignedIn ? 'Not eligible' : 'Sign in'}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoStat({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-white ring-1 ring-rose-100 flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-rose-400 font-medium">{label}</span>
      <span className="text-rose-700 mt-1 font-semibold truncate">{value}</span>
    </div>
  )
}
