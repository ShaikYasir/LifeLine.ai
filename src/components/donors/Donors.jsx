// search functionality removed; no state needed here
import { formatDate } from '../../lib/utils';
import { User, Award, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DonorCard = ({ donor }) => {
  const lastDonationRaw = donor.last_donation_date || donor.lastDonation;
  const lastDonationDisplay = formatDate(lastDonationRaw) || 'Never';
  const total = donor.donations_till_date || donor.totalDonations || (donor.donations ? donor.donations.length : 0);
  return (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-primary-100 hover:border-primary-200 transition-all hover:shadow-md">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-50 rounded-full">
          <User className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-medium text-primary-900 flex items-center gap-2 flex-wrap">
            {donor.name}
            {donor.isBridge && (
              <span className="text-[10px] uppercase tracking-wide bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Bridge</span>
            )}
            {(donor.role || '').toLowerCase().includes('emergency') && (
              <span className="text-[10px] uppercase tracking-wide bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Emergency</span>
            )}
          </h3>
          <p className="text-sm text-primary-600">{donor.bridgeId}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary-50 text-primary-700">
        {donor.blood_group}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
      <div>
        <p className="text-primary-600">Status</p>
        {(() => {
          const raw = donor.user_donation_active_status || donor.status || '';
          const isActive = /active/i.test(raw) && !/inact/i.test(raw);
          return <p className="font-medium text-primary-900">{isActive ? 'Active' : 'Not Active'}</p>;
        })()}
      </div>
      <div>
        <p className="text-primary-600">Type</p>
  <p className="font-medium text-primary-900">{donor.blood_group || donor.donor_type || 'N/A'}</p>
      </div>
      <div>
        <p className="text-primary-600">Last Donation</p>
        <p className="font-medium text-primary-900">{lastDonationDisplay}</p>
      </div>
      <div>
        <p className="text-primary-600">Total Donations</p>
  <p className="font-medium text-primary-900">{total}</p>
      </div>
    </div>
    <div className="flex items-center justify-between text-xs">
      <span className={`px-2 py-1 rounded-full ${
        donor.eligibility_status === 'eligible' 
          ? 'bg-green-50 text-green-700' 
          : 'bg-red-50 text-red-700'
      }`}>
        {donor.eligibility_status === 'eligible' ? 'Eligible' : 'Not Eligible'}
      </span>
      <Link 
        to={`/donors/${donor.bridgeId}`} 
        className="text-primary-600 hover:text-primary-800 flex items-center gap-1"
      >
        View Details
        <ArrowUpRight className="w-3 h-3" />
      </Link>
    </div>
  </div>
);
};

const TopGiverCard = ({ donor }) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-primary-100 hover:border-primary-200 transition-all">
    <div className="p-3 bg-primary-50 rounded-full">
      <Award className="w-6 h-6 text-primary-600" />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-medium text-primary-900">{donor.name}</h3>
        <span className="text-sm font-medium text-primary-700">{donor.blood_group}</span>
      </div>
      <p className="text-sm text-primary-600 mb-2">{donor.bridgeId}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-primary-600">
          {donor.donations_till_date || '0'} donations
        </span>
        <Link 
          to={`/donors/${donor.bridgeId}`}
          className="text-primary-600 hover:text-primary-800 flex items-center gap-1 text-xs"
        >
          View Details
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  </div>
);

export default function Donors({ donorData }) {

  const donors = donorData?.donors || [];

  // Normalized accessor helpers
  const getBlood = (d) => d.blood_group || d.bloodGroup || 'N/A';
  const getDonations = (d) => parseInt(d.donations_till_date || d.totalDonations || 0) || 0;

  // Limit to first 50 donors (search removed)
  const filteredDonors = donors.slice(0, 50);

  // Top 10 donors by total donations (recognition)
  const topGivers = [...donors]
    .sort((a, b) => getDonations(b) - getDonations(a))
    .slice(0, 10);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-start">
        <h1 className="text-2xl font-semibold text-primary-900">Donor Directory</h1>
      </div>

      {/* Top Givers Section */}
      <div className="bg-gradient-to-r from-primary-50/50 to-primary-100/30 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Top Blood Donors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topGivers.map((donor) => (
            <TopGiverCard key={donor.id} donor={{
              ...donor,
              blood_group: getBlood(donor),
              donations_till_date: getDonations(donor)
            }} />
          ))}
        </div>
      </div>

      {/* All Donors Grid */}
      <div>
        <h2 className="text-lg font-semibold text-primary-900 mb-4">All Donors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => (
            <DonorCard key={donor.id} donor={{
              ...donor,
              blood_group: getBlood(donor),
              donations_till_date: getDonations(donor)
            }} />
          ))}
        </div>
        {filteredDonors.length === 0 && (
          <div className="text-center py-8 text-primary-600">No donors available.</div>
        )}
        {donors.length > 50 && (
          <p className="text-xs text-primary-500 mt-4">Showing first 50 of {donors.length} donors</p>
        )}
      </div>
    </div>
  );
}
