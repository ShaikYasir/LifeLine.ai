import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import supercluster from 'supercluster';
import 'leaflet/dist/leaflet.css';

// Basic icon (Leaflet's default assets may need handling in bundler; inline circle marker alternative)
const donorIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Cluster layer component
function ClusterLayer({ points, radius=60, onSelectCluster }) {
  const map = useMap();
  const bounds = map.getBounds();
  const zoom = map.getZoom();
  const cluster = useMemo(()=>{
    const idx = new supercluster({ radius, maxZoom: 18 });
  idx.load(points.map(p=>({
      type:'Feature',
      properties:{
        cluster: false,
        donorId: p.id,
        name: p.name,
        blood: p.bloodGroup,
        donations: p.totalDonations || 0,
    role: p.role || '',
    bridgeId: p.bridgeId
      },
      geometry:{ type:'Point', coordinates:[p.longitude, p.latitude] }
    })));
    return idx;
  }, [points, radius]);

  const clusters = useMemo(()=>{
    if(!bounds) return [];
    const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
    return cluster.getClusters(bbox, Math.round(zoom));
  }, [cluster, bounds, zoom]);

  return clusters.map(f=>{
    const [lng, lat] = f.geometry.coordinates;
    const count = f.properties.point_count;
    if(count){
      const size = 30 + (count/points.length)*40;
      return (
        <Marker
          key={`c-${f.id}`}
          position={[lat,lng]}
          icon={L.divIcon({
            html:`<div style="background:#ff5959;color:#fff;width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;box-shadow:0 0 4px rgba(0,0,0,0.25);">${count}</div>`,
            className: 'cluster-marker',
            iconSize:[size,size]
          })}
          eventHandlers={{ click: ()=>{
            const expansionZoom = Math.min(cluster.getClusterExpansionZoom(f.id), 18);
            map.setView([lat,lng], expansionZoom, { animate:true });
            if(onSelectCluster){
              const leaves = cluster.getLeaves(f.id, 200).map(l=>({
                id: l.properties.donorId,
                name: l.properties.name,
                bloodGroup: l.properties.blood,
                totalDonations: l.properties.donations,
                role: l.properties.role,
                bridgeId: l.properties.bridgeId
              }));
              onSelectCluster({ center:[lat,lng], count, leaves });
            }
          }}}
        />
      );
    }
    // Single point
    return (
      <Marker key={f.properties.donorId} position={[lat,lng]} icon={donorIcon}>
        <Popup>
          <div className="space-y-1">
            <div className="font-semibold text-sm">{f.properties.name}</div>
            <div className="text-xs text-primary-600">Blood: {f.properties.blood}</div>
            <div className="text-xs text-primary-600">Donations: {f.properties.donations}</div>
            {f.properties.role && <div className="text-[10px] uppercase tracking-wide text-primary-700">{f.properties.role}</div>}
          </div>
        </Popup>
      </Marker>
    );
  });
}

// Component to handle double-click reset events
function ResetOnDoubleClick({ onReset }) {
  useMapEvents({
    dblclick() {
      onReset && onReset();
    }
  });
  return null;
}

export default function Emergencies({ donorData }) {
  const geoPoints = useMemo(()=> {
    const donors = donorData?.donors || [];
    return donors.filter(d=> d.latitude && d.longitude);
  }, [donorData]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const initialCenter = [17.3922792,78.4602749];
  const initialZoom = 11;
  const [mapKey, setMapKey] = useState(0); // force rerender if needed

  const handleReset = () => {
    setSelectedCluster(null);
    // Trigger soft reset by bumping key (ensures view recenters); alternative is programmatic map fly using a ref
    setMapKey(k=>k+1);
  };

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ phone:'', bloodGroup:'', area:'' });
  const bloodGroups = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
  const [bloodFilter, setBloodFilter] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    if(!formData.phone || !formData.bloodGroup || !formData.area) return; // simple guard
    setSubmitted(true);
    setTimeout(()=> setShowForm(false), 1800); // auto hide form after feedback
  };

  // Filter points by selected blood group (if any)
  const filteredPoints = useMemo(()=> {
    if(!bloodFilter) return geoPoints;
    return geoPoints.filter(p=> p.bloodGroup === bloodFilter);
  }, [geoPoints, bloodFilter]);

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900">Emergency Map</h1>
          <p className="text-primary-600 text-sm">Geospatial distribution & clustering of donors.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={()=> { setShowForm(s=>!s); setSubmitted(false); }}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 shadow-sm"
          >{showForm ? 'Close Request' : 'Request Help'}</button>
          <div className="flex items-center gap-2">
            <select
              value={bloodFilter}
              onChange={e=> { setBloodFilter(e.target.value); setSelectedCluster(null); setMapKey(k=>k+1); }}
              className="px-3 py-2 rounded-lg border border-rose-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              title="Filter donors by blood group"
            >
              <option value="">All Groups</option>
              {bloodGroups.map(bg=> <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
        </div>
      </header>
      {showForm && (
        <div className="rounded-xl border border-rose-200 bg-white shadow-sm p-5">
          <h2 className="text-sm font-semibold text-rose-700 mb-4">Emergency Blood Request</h2>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-rose-500 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 rounded-md border border-rose-200 focus:ring-2 focus:ring-rose-400 outline-none text-sm"
                required
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-rose-500 mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-rose-200 focus:ring-2 focus:ring-rose-400 outline-none text-sm bg-white"
                required
              >
                <option value="" disabled>Select</option>
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-rose-500 mb-1">Area / Location</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="City / Locality"
                className="w-full px-3 py-2 rounded-md border border-rose-200 focus:ring-2 focus:ring-rose-400 outline-none text-sm"
                required
              />
            </div>
            <div className="sm:col-span-3 flex items-center gap-3 pt-2">
              <button type="submit" className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 shadow-sm disabled:opacity-40" disabled={submitted}>Submit</button>
              {submitted && (
                <div className="px-4 py-2 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium animate-fade-in">Your blood angel is coming.</div>
              )}
            </div>
          </form>
        </div>
      )}
  <div className="flex-1 min-h-[500px] rounded-xl overflow-hidden border border-primary-100 relative">
        {/* Reset/Refresh button */}
        {selectedCluster && (
          <button
            onClick={handleReset}
            className="absolute z-[1000] top-3 right-3 bg-white/90 hover:bg-white text-primary-700 border border-primary-100 px-3 py-1 rounded-md text-xs font-medium shadow-sm"
            title="Reset map view (Esc cluster or double-click map)"
          >
            Refresh
          </button>
        )}
        <MapContainer key={mapKey} center={initialCenter} zoom={initialZoom} style={{ height:'100%', width:'100%' }} scrollWheelZoom doubleClickZoom={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <ClusterLayer points={filteredPoints} onSelectCluster={setSelectedCluster} />
          <ResetOnDoubleClick onReset={handleReset} />
        </MapContainer>
      </div>
      {selectedCluster && (
        <div className="bg-white p-4 rounded-xl border border-primary-100 shadow-sm max-h-64 overflow-auto">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-sm font-semibold text-primary-900">Cluster Donors ({selectedCluster.count})</h2>
            <button className="text-xs text-primary-500 hover:text-primary-700" onClick={()=>setSelectedCluster(null)}>Close</button>
          </div>
          <ul className="divide-y divide-primary-100 text-xs">
            {selectedCluster.leaves.sort((a,b)=> (b.totalDonations||0) - (a.totalDonations||0)).map(d=> (
              <li key={d.id} className="py-2 flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-primary-900">{d.name}</div>
                  <div className="text-[10px] text-primary-500">{d.bloodGroup} · {d.role || 'Donor'}</div>
                </div>
                <div className="text-[10px] text-primary-600 font-semibold">{d.totalDonations}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}