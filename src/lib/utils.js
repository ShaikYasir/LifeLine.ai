import Papa from "papaparse";

// Helper function to parse dates
const parseDate = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString
    .split("-")
    .map((num) => parseInt(num, 10));
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = parseDate(dateString);
  if (!date) return dateString;

  const day = date.getDate();
  const month = getMonthName(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Get month name helper
const getMonthName = (month) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month - 1] || "";
};

// Generate a synthetic donation history when only last date + count exist
function generateDonationHistory(
  lastDateStr,
  total,
  frequencyDays,
  registrationDateStr
) {
  const history = [];
  if (!lastDateStr || !total || total <= 0) return history;
  const lastDate = parseDate(lastDateStr);
  if (!lastDate) return history;
  const freq =
    (parseInt(frequencyDays) || 0) > 0 ? parseInt(frequencyDays) : 90; // default spacing
  const registration = registrationDateStr
    ? parseDate(registrationDateStr)
    : null;

  for (let i = 0; i < total; i++) {
    const d = new Date(lastDate.getTime() - i * freq * 24 * 60 * 60 * 1000);
    if (registration && d < registration) break; // don't go earlier than registration
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    history.push({
      id: `don-${i + 1}`,
      date: `${dd}-${mm}-${yyyy}`,
      location: "Unknown",
      emergency: false,
    });
  }
  return history; // newest first
}

// Main function to process dataset with grouping + history
export const processDataset = (csvData) => {
  const parseResult = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });
  const rows = parseResult.data;

  const map = new Map(); // key: user_id (or synthetic)
  rows.forEach((row) => {
    const userId =
      row.user_id || row.bridge_id || row.id || row.userID || row.uid || null;
    if (!userId) return; // skip malformed row
    if (!map.has(userId)) {
      map.set(userId, {
        _sourceRows: [],
        rawUserId: userId,
        name: row.name?.trim() || `Donor ${map.size + 1}`,
        bloodGroup: normalizeBlood(row.blood_group || row.bridge_blood_group),
        role: row.role || "",
        isBridge: (row.role || "").toLowerCase().includes("bridge"),
        status: row.user_donation_active_status || row.status || "Unknown",
        user_donation_active_status:
          row.user_donation_active_status || row.status || "Unknown",
        donorType: row.donor_type || "Unknown",
        eligibility: row.eligibility_status || "unknown",
        lastDonation: row.last_donation_date || "",
        nextDonation:
          row.expected_next_transfusion_date || row.next_eligible_date || "",
        totalDonations: parseInt(row.donations_till_date) || 0,
        frequencyDays: row.frequency_in_days || row.cycle_of_donations || 90,
        registrationDate: row.registration_date || "",
        location: row.location || "—",
        phone: row.phone || "—",
        latitude: row.latitude ? parseFloat(row.latitude) : null,
        longitude: row.longitude ? parseFloat(row.longitude) : null,
      });
    }
    const current = map.get(userId);
    current._sourceRows.push(row);
    // Update with more recent lastDonation if present
    if (row.last_donation_date) {
      const existing = parseDate(current.lastDonation);
      const incoming = parseDate(row.last_donation_date);
      if (!existing || (incoming && incoming > existing)) {
        current.lastDonation = row.last_donation_date;
      }
    }
    // Keep max total donations
    const incomingTotal = parseInt(row.donations_till_date) || 0;
    if (incomingTotal > current.totalDonations)
      current.totalDonations = incomingTotal;
  });

  const donors = Array.from(map.values()).map((record, index) => {
    const donations = generateDonationHistory(
      record.lastDonation,
      record.totalDonations,
      record.frequencyDays,
      record.registrationDate
    );
    return {
      id: `donor-${index + 1}`,
      name: record.name,
      bloodGroup: record.bloodGroup,
      blood_group: record.bloodGroup, // alias for components
      role: record.role,
      isBridge: record.isBridge,
      status: record.status,
      user_donation_active_status: record.user_donation_active_status,
      donorType: record.donorType,
      donor_type: record.donorType, // alias
      eligibility: record.eligibility,
      eligibility_status: record.eligibility, // alias
      lastDonation: record.lastDonation,
      last_donation_date: record.lastDonation, // alias
      nextDonation: record.nextDonation,
      totalDonations: record.totalDonations,
      donations_till_date: record.totalDonations, // alias
      location: record.location,
      phone: record.phone,
      latitude: record.latitude,
      longitude: record.longitude,
      bridgeId: generateBridgeId(
        { name: record.name, blood_group: record.bloodGroup },
        index
      ),
      donations, // array newest first
    };
  });

  const stats = {
    totalDonors: donors.length,
    activeDonors: donors.filter((d) => d.status === "Active").length,
    emergencyDonors: rows.filter((r) => r.role === "Emergency Donor").length,
    eligibleDonors: donors.filter((d) => d.eligibility === "eligible").length,
    bloodGroups: donors.reduce((acc, d) => {
      if (d.bloodGroup && d.bloodGroup !== "N/A") {
        acc[d.bloodGroup] = (acc[d.bloodGroup] || 0) + 1;
      }
      return acc;
    }, {}),
  };

  return { donors, stats };
};

function normalizeBlood(bg) {
  if (!bg) return "N/A";
  return bg
    .replace(" Positive", "+")
    .replace(" Negative", "-")
    .replace(/\s+/g, " ")
    .trim();
}

// Generate a bridge ID for a donor
const generateBridgeId = (donor, index) => {
  const name = donor.name || "";
  const bloodGroup = (donor.blood_group || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  // Get initials from name
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toLowerCase();

  // Create bridge ID
  const numericPart = (index + 1).toString().padStart(3, "0");
  return `${initials}${bloodGroup}_${numericPart}`;
};
