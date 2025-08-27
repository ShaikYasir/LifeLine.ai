import { useParams, Link } from 'react-router-dom';
import { formatDate } from '../../lib/utils';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle, 
  Activity,
  ChevronLeft,
  Clock,
  Award,
  Heart
} from 'lucide-react';

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
    status === 'Active' ? 'bg-green-50 text-green-700' :
    status === 'Inactive' ? 'bg-red-50 text-red-700' :
    'bg-yellow-50 text-yellow-700'
  }`}>
    {status}
  </span>
);

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-primary-100">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-primary-50 rounded-full">
  {icon && (() => { const IconEl = icon; return <IconEl className="w-4 h-4 text-primary-600" />; })()}
      </div>
      <span className="text-sm text-primary-600">{label}</span>
    </div>
    <p className="text-lg font-medium text-primary-900 ml-12">{value}</p>
  </div>
);

const DonationTimeline = ({ donations }) => (
  <div className="space-y-4">
    {donations.map((donation, index) => (
      <div key={index} className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-600" />
          </div>
          {index !== donations.length - 1 && (
            <div className="w-0.5 h-full bg-primary-100 mt-2"></div>
          )}
        </div>
        <div className="flex-1 pb-4">
          <p className="text-primary-900 font-medium">Donation #{donations.length - index}</p>
          <p className="text-sm text-primary-600">{donation.date}</p>
          {donation.emergency && (
            <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full mt-2">
              <AlertTriangle className="w-3 h-3" />
              Emergency Donation
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default function DonorProfile({ donorData }) {
  const { id } = useParams();
  
  // Find the donor from the data
  const donor = donorData?.donors?.find(d => d.id === id || d.bridgeId === id);

  if (!donor) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-primary-600">Donor not found.</p>
          <Link to="/donors" className="text-primary-500 hover:text-primary-600 mt-2 inline-block">
            Return to Donor Directory
          </Link>
        </div>
      </div>
    );
  }

  // Use real (synthetic-generated) donation history from dataset processing
  const donationHistoryRaw = donor.donations && donor.donations.length ? donor.donations : [];
  const donationHistory = donationHistoryRaw.map((d) => ({
    ...d,
    date: formatDate(d.date)
  }));

  // Derive totals & last donation from history if present
  const derivedTotalDonations = donationHistory.length;
  const totalDonations = derivedTotalDonations || donor.donations_till_date || donor.totalDonations || 0;
  const derivedLastDonation = donationHistory[0]?.date || formatDate(donor.last_donation_date) || formatDate(donor.lastDonation) || 'Never';
  const bloodType = donor.blood_group || donor.bloodGroup || 'N/A';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header with back button */}
      <div className="mb-6">
        <Link 
          to="/donors" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Directory
        </Link>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary-50 rounded-full">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-primary-900 flex items-center gap-2 flex-wrap">
                {donor.name}
                {donor.isBridge && (
                  <span className="text-[10px] uppercase tracking-wide bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Bridge</span>
                )}
                {(donor.role || '').toLowerCase().includes('emergency') && (
                  <span className="text-[10px] uppercase tracking-wide bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Emergency</span>
                )}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-primary-600">{donor.bridgeId}</p>
                <StatusBadge status={donor.user_donation_active_status} />
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-primary-600">Blood Type <span className="ml-2 text-lg font-semibold text-primary-900 align-middle">{bloodType}</span></div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <InfoCard 
          icon={Award} 
          label="Donor Type" 
          value={donor.donor_type || donor.donorType || 'Regular Donor'} 
        />
        <InfoCard 
          icon={Activity} 
          label="Total Donations" 
          value={totalDonations} 
        />
        <InfoCard 
          icon={Calendar} 
          label="Last Donation" 
          value={derivedLastDonation} 
        />
        <InfoCard 
          icon={Clock} 
          label="Next Eligible Date" 
          value={donor.expected_next_transfusion_date || 'Available Now'} 
        />
        <InfoCard 
          icon={Phone} 
          label="Contact" 
          value={donor.phone || 'Not provided'} 
        />
        <InfoCard 
          icon={MapPin} 
          label="Location" 
          value={donor.location || 'Not provided'} 
        />
      </div>

      {/* Donation History */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
        <h2 className="text-lg font-semibold text-primary-900 mb-6">Donation History</h2>
        {donationHistory.length > 0 ? (
          <DonationTimeline donations={donationHistory} />
        ) : (
          <p className="text-sm text-primary-600">No donation history available.</p>
        )}
      </div> */}
    </div>
  );
}
