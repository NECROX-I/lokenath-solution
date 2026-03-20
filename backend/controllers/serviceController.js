// Static services data - no DB model needed
const services = [
  {
    id: 'tax-payment',
    title: 'Tax Payment Assistance',
    icon: '🧾',
    shortDesc: 'File your income tax, GST returns, and property tax with expert guidance.',
    description: 'We help individuals and small businesses with all types of tax filing — ITR, GST returns, TDS, property tax, and more. Our team ensures accurate and timely submissions to avoid penalties.',
    documents: [
      'PAN Card',
      'Aadhaar Card',
      'Bank statements (last 6 months)',
      'Form 16 (for salaried individuals)',
      'Business income proof (if applicable)',
      'Previous year ITR copy'
    ],
    charges: 'Starting from ₹200',
    duration: '1–3 working days'
  },
  {
    id: 'money-transfer',
    title: 'Online Money Transfer',
    icon: '💸',
    shortDesc: 'Fast and secure NEFT, RTGS, IMPS, and UPI transfers at your doorstep.',
    description: 'Send money anywhere in India quickly and safely. We handle NEFT, RTGS, IMPS, and UPI transfers. Ideal for people without internet banking access or who need assistance with large transfers.',
    documents: [
      'Valid government ID',
      'Sender bank account details',
      'Recipient bank account details / UPI ID',
      'Source of funds proof (for large amounts)'
    ],
    charges: 'Minimal service charge applies',
    duration: 'Same day (within banking hours)'
  },
  {
    id: 'government-schemes',
    title: 'Government Schemes Application',
    icon: '🏛️',
    shortDesc: 'Apply for PM Awas Yojana, Kisan Samman Nidhi, scholarships & more.',
    description: 'We assist citizens in applying for various central and state government welfare schemes — PM Awas Yojana, PM Kisan, Sukanya Samriddhi, scholarships, pensions, and other benefits you are entitled to.',
    documents: [
      'Aadhaar Card',
      'Ration Card',
      'Income Certificate',
      'Bank passbook',
      'Caste/Category Certificate (if applicable)',
      'Scheme-specific documents'
    ],
    charges: 'Starting from ₹100 per application',
    duration: '2–7 working days'
  },
  {
    id: 'aadhaar-services',
    title: 'Aadhaar Services',
    icon: '🪪',
    shortDesc: 'New enrollment, updates, corrections, and linking — all Aadhaar services.',
    description: 'Comprehensive Aadhaar services including new enrollment, name/address/DOB corrections, mobile number linking, biometric updates, and downloading e-Aadhaar. We are an authorized Aadhaar enrollment center.',
    documents: [
      'Proof of Identity (Passport / Voter ID / PAN)',
      'Proof of Address (Bank passbook / Utility bill)',
      'Date of Birth proof (Birth certificate / School certificate)',
      'Existing Aadhaar (for updates/corrections)'
    ],
    charges: 'As per UIDAI norms',
    duration: 'Same day enrollment; updates within 7–10 days'
  },
  {
    id: 'voter-id',
    title: 'Voter ID Services',
    icon: '🗳️',
    shortDesc: 'New voter registration, corrections, address update, and EPIC download.',
    description: 'We help you apply for a new Voter ID (EPIC), correct existing details, update your address, or link your voter ID with Aadhaar. Ensure your democratic rights are protected.',
    documents: [
      'Aadhaar Card',
      'Proof of Age (Birth Certificate / Marksheet)',
      'Proof of Residence',
      'Passport-size photograph',
      'Existing Voter ID (for corrections/updates)'
    ],
    charges: 'Service charge from ₹50',
    duration: '7–30 working days (subject to ECI)'
  },
  {
    id: 'ration-card',
    title: 'Ration Card Services',
    icon: '🍚',
    shortDesc: 'Apply for new ration card, add/remove members, corrections, and transfers.',
    description: "Get help with ration card applications, member additions or deletions, category changes (APL/BPL), address transfers, and name corrections. Ensure your family's food security entitlements.",
    documents: [
      'Aadhaar Card (all family members)',
      'Proof of Residence',
      'Income Certificate',
      'Passport-size photographs',
      'Existing ration card (for updates)',
      'Gas connection details'
    ],
    charges: 'Starting from ₹100',
    duration: '7–15 working days'
  },
  {
    id: 'form-filling',
    title: 'Online Form Filling',
    icon: '📝',
    shortDesc: 'Any government or private online form filled accurately and quickly.',
    description: 'Struggling with online forms? We fill any form for you — job applications, scholarship forms, college admissions, bank account openings, insurance claims, license renewals, and much more. Accurate, quick, and error-free.',
    documents: [
      'Depends on the specific form',
      'Basic identity proof (Aadhaar / PAN)',
      'Relevant certificates and marksheets',
      'Passport-size photographs (if required)'
    ],
    charges: 'Starting from ₹30 per form',
    duration: 'Same day'
  }
];

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = (req, res) => {
  res.json({ success: true, count: services.length, services });
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getService = (req, res) => {
  const service = services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, service });
};

module.exports = { getServices, getService };