// Doctor database with location and specialization

export interface DoctorInfo {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  hospital: string;
  location: string;
  city: string;
  area: string;
  phone: string;
  email: string;
  consultationFee: number;
  rating: number;
  reviews: number;
  availableTime: string;
  specialties: string[];
  conditions: string[];
  latitude: number;
  longitude: number;
}

// Comprehensive doctor database with locations in Pakistan
export const doctorsDatabase: DoctorInfo[] = [
  // General Practitioners
  {
    id: 'doc_001',
    name: 'Dr. Ahmed Hassan',
    specialization: 'General Practitioner',
    qualification: 'MBBS, FCPS',
    experience: 15,
    hospital: 'Shaukat Khanum Memorial Cancer Hospital',
    location: 'Main Boulevard, Phase 5',
    city: 'Lahore',
    area: 'DHA Phase 5',
    phone: '+92-42-35180000',
    email: 'ahmed.hassan@skm.org.pk',
    consultationFee: 1500,
    rating: 4.8,
    reviews: 245,
    availableTime: '10:00 AM - 6:00 PM',
    specialties: ['general practice', 'fever', 'cold', 'cough', 'body pain'],
    conditions: ['common cold', 'flu', 'fever management', 'general health'],
    latitude: 31.5000,
    longitude: 74.3500,
  },
  {
    id: 'doc_002',
    name: 'Dr. Fatima Malik',
    specialization: 'General Practitioner',
    qualification: 'MBBS, DPT',
    experience: 10,
    hospital: 'Aga Khan University Hospital',
    location: 'Stadium Road',
    city: 'Karachi',
    area: 'Clifton',
    phone: '+92-21-34864000',
    email: 'fatima.malik@aku.edu.pk',
    consultationFee: 1200,
    rating: 4.6,
    reviews: 189,
    availableTime: '9:00 AM - 5:00 PM',
    specialties: ['general practice', 'fever', 'cough', 'stomach pain', 'allergy'],
    conditions: ['common cold', 'gastroenteritis', 'allergies', 'general health'],
    latitude: 24.7890,
    longitude: 67.0180,
  },

  // Cardiologists
  {
    id: 'doc_003',
    name: 'Dr. Muhammad Ali Khan',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD Cardiology, FCPS',
    experience: 20,
    hospital: 'National Institute of Cardiovascular Diseases',
    location: 'Shafi Burn Center Road',
    city: 'Islamabad',
    area: 'G-7',
    phone: '+92-51-9261500',
    email: 'mah.khan@nicvd.org.pk',
    consultationFee: 3000,
    rating: 4.9,
    reviews: 512,
    availableTime: '11:00 AM - 4:00 PM',
    specialties: ['cardiology', 'heart disease', 'high blood pressure', 'angina', 'hypertension'],
    conditions: ['heart disease', 'hypertension', 'arrhythmia', 'coronary artery disease'],
    latitude: 33.7414,
    longitude: 73.1793,
  },
  {
    id: 'doc_004',
    name: 'Dr. Ayesha Rizvi',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD, FCPS Cardiology',
    experience: 18,
    hospital: 'Indus Hospital',
    location: 'Korangi, Landhi',
    city: 'Karachi',
    area: 'Korangi',
    phone: '+92-21-35119999',
    email: 'ayesha.rizvi@indushealth.org.pk',
    consultationFee: 2500,
    rating: 4.7,
    reviews: 378,
    availableTime: '10:00 AM - 3:00 PM',
    specialties: ['cardiology', 'heart disease', 'high blood pressure', 'chest pain'],
    conditions: ['heart disease', 'hypertension', 'angina', 'heart failure'],
    latitude: 24.8450,
    longitude: 67.2050,
  },

  // Pulmonologists
  {
    id: 'doc_005',
    name: 'Dr. Hassan Raza',
    specialization: 'Pulmonologist',
    qualification: 'MBBS, MD Respiratory Medicine, FCPS',
    experience: 16,
    hospital: 'Jinnah Medical and Dental College',
    location: 'Ghazni Street',
    city: 'Lahore',
    area: 'Mall Road',
    phone: '+92-42-99264040',
    email: 'hassan.raza@jmdc.edu.pk',
    consultationFee: 2000,
    rating: 4.8,
    reviews: 298,
    availableTime: '2:00 PM - 7:00 PM',
    specialties: ['pulmonology', 'respiratory infection', 'cough', 'bronchitis', 'asthma'],
    conditions: ['respiratory infection', 'bronchitis', 'asthma', 'pneumonia', 'COPD'],
    latitude: 31.5607,
    longitude: 74.3157,
  },
  {
    id: 'doc_006',
    name: 'Dr. Zainab Ahmed',
    specialization: 'Pulmonologist',
    qualification: 'MBBS, FCPS Chest',
    experience: 12,
    hospital: 'Pakistan Institute of Medical Sciences',
    location: 'G-7/2',
    city: 'Islamabad',
    area: 'Pitras Bukhari',
    phone: '+92-51-9261500',
    email: 'zainab.ahmed@pims.gov.pk',
    consultationFee: 1800,
    rating: 4.5,
    reviews: 156,
    availableTime: '9:00 AM - 1:00 PM, 3:00 PM - 6:00 PM',
    specialties: ['pulmonology', 'cough', 'respiratory infection', 'asthma'],
    conditions: ['respiratory infection', 'asthma', 'bronchitis', 'chest infection'],
    latitude: 33.7298,
    longitude: 73.1938,
  },

  // Gastroenterologists
  {
    id: 'doc_007',
    name: 'Dr. Imran Khan',
    specialization: 'Gastroenterologist',
    qualification: 'MBBS, MD Gastroenterology, FCPS',
    experience: 17,
    hospital: 'Liaquat National Hospital',
    location: 'Karachi',
    city: 'Karachi',
    area: 'Clifton Block 5',
    phone: '+92-21-34835000',
    email: 'imran.khan@lnh.com.pk',
    consultationFee: 2200,
    rating: 4.7,
    reviews: 267,
    availableTime: '10:00 AM - 5:00 PM',
    specialties: ['gastroenterology', 'stomach pain', 'acid reflux', 'nausea', 'diarrhea'],
    conditions: ['GERD', 'gastroenteritis', 'peptic ulcer', 'IBS', 'liver disease'],
    latitude: 24.7864,
    longitude: 67.0276,
  },
  {
    id: 'doc_008',
    name: 'Dr. Saira Nasir',
    specialization: 'Gastroenterologist',
    qualification: 'MBBS, MD, FCPS Gastroenterology',
    experience: 14,
    hospital: 'Rawalpindi Medical University Hospital',
    location: 'Adiala Road',
    city: 'Rawalpindi',
    area: 'Adiala Road',
    phone: '+92-51-5225000',
    email: 'saira.nasir@rmu.edu.pk',
    consultationFee: 2000,
    rating: 4.6,
    reviews: 234,
    availableTime: '11:00 AM - 6:00 PM',
    specialties: ['gastroenterology', 'stomach pain', 'acid reflux', 'diarrhea', 'nausea'],
    conditions: ['GERD', 'gastroenteritis', 'IBS', 'dyspepsia', 'constipation'],
    latitude: 33.1948,
    longitude: 73.2673,
  },

  // Dermatologists
  {
    id: 'doc_009',
    name: 'Dr. Hina Baig',
    specialization: 'Dermatologist',
    qualification: 'MBBS, MD Dermatology, FCPS',
    experience: 13,
    hospital: 'Services Hospital',
    location: 'Jilani Road',
    city: 'Lahore',
    area: 'Jinnah Park',
    phone: '+92-42-99231340',
    email: 'hina.baig@services-lhr.gov.pk',
    consultationFee: 1800,
    rating: 4.8,
    reviews: 345,
    availableTime: '11:00 AM - 7:00 PM',
    specialties: ['dermatology', 'skin rash', 'itching', 'acne', 'eczema', 'allergy'],
    conditions: ['eczema', 'dermatitis', 'acne vulgaris', 'urticaria', 'psoriasis'],
    latitude: 31.5368,
    longitude: 74.3414,
  },
  {
    id: 'doc_010',
    name: 'Dr. Faisal Noor',
    specialization: 'Dermatologist',
    qualification: 'MBBS, MD Dermatology, FCPS',
    experience: 11,
    hospital: 'Mott MacDonald Hospital',
    location: 'Peshawar',
    city: 'Peshawar',
    area: 'Hayatabad',
    phone: '+92-91-9213000',
    email: 'faisal.noor@mottmac.com.pk',
    consultationFee: 1600,
    rating: 4.5,
    reviews: 198,
    availableTime: '10:00 AM - 6:00 PM',
    specialties: ['dermatology', 'skin rash', 'acne', 'itching', 'eczema'],
    conditions: ['acne', 'eczema', 'dermatitis', 'psoriasis', 'fungal infections'],
    latitude: 34.0151,
    longitude: 71.5249,
  },

  // Infectious Disease Specialists
  {
    id: 'doc_011',
    name: 'Dr. Kamran Siddiqui',
    specialization: 'Infectious Disease Specialist',
    qualification: 'MBBS, MD, FCPS Infectious Diseases',
    experience: 19,
    hospital: 'Mayo Hospital',
    location: 'Lower Mall Road',
    city: 'Lahore',
    area: 'Mayo Hospital',
    phone: '+92-42-99256000',
    email: 'kamran.siddiqui@mayo.edu.pk',
    consultationFee: 2700,
    rating: 4.7,
    reviews: 289,
    availableTime: '9:00 AM - 4:00 PM',
    specialties: ['infectious disease', 'bacterial infection', 'sore throat', 'respiratory infection', 'fever'],
    conditions: ['bacterial infection', 'viral infection', 'throat infection', 'respiratory tract infection'],
    latitude: 31.5436,
    longitude: 74.3238,
  },
  {
    id: 'doc_012',
    name: 'Dr. Nausheen Khan',
    specialization: 'Infectious Disease Specialist',
    qualification: 'MBBS, FCPS Microbiology, MD',
    experience: 15,
    hospital: 'Civil Hospital',
    location: 'Bahadurabad',
    city: 'Quetta',
    area: 'Bahadurabad',
    phone: '+92-81-9211400',
    email: 'nausheen.khan@civil-quetta.gov.pk',
    consultationFee: 2000,
    rating: 4.6,
    reviews: 212,
    availableTime: '10:00 AM - 5:00 PM',
    specialties: ['infectious disease', 'bacterial infection', 'fever', 'respiratory infection'],
    conditions: ['bacterial infection', 'throat infection', 'respiratory infection', 'fever'],
    latitude: 30.1798,
    longitude: 67.0076,
  },

  // Endocrinologists
  {
    id: 'doc_013',
    name: 'Dr. Adnan Mirza',
    specialization: 'Endocrinologist',
    qualification: 'MBBS, MD Endocrinology, FCPS',
    experience: 18,
    hospital: 'Allied Hospital',
    location: 'Ferozepur Road',
    city: 'Faisalabad',
    area: 'Ferozepur Road',
    phone: '+92-41-9230000',
    email: 'adnan.mirza@allied-fsd.gov.pk',
    consultationFee: 2500,
    rating: 4.8,
    reviews: 356,
    availableTime: '10:00 AM - 3:00 PM',
    specialties: ['endocrinology', 'diabetes', 'high blood sugar', 'thyroid', 'hormonal imbalance'],
    conditions: ['type 2 diabetes', 'thyroid disease', 'hormonal imbalance', 'PCOS'],
    latitude: 31.4181,
    longitude: 72.3311,
  },
  {
    id: 'doc_014',
    name: 'Dr. Shireen Malik',
    specialization: 'Endocrinologist',
    qualification: 'MBBS, MD, FCPS Endocrinology',
    experience: 14,
    hospital: 'Holy Family Hospital',
    location: 'Multan Road',
    city: 'Multan',
    area: 'Vehari Chowk',
    phone: '+92-61-9200000',
    email: 'shireen.malik@holyfamily-mtn.org.pk',
    consultationFee: 2200,
    rating: 4.5,
    reviews: 178,
    availableTime: '11:00 AM - 6:00 PM',
    specialties: ['endocrinology', 'diabetes', 'thyroid', 'high blood sugar'],
    conditions: ['diabetes', 'thyroid disease', 'metabolic syndrome', 'obesity'],
    latitude: 30.1575,
    longitude: 71.4454,
  },

  // ENT Specialists
  {
    id: 'doc_015',
    name: 'Dr. Wasiq Ahmed',
    specialization: 'ENT Specialist',
    qualification: 'MBBS, MS ENT, FCPS',
    experience: 16,
    hospital: 'Lahore General Hospital',
    location: 'Racecourse',
    city: 'Lahore',
    area: 'Racecourse',
    phone: '+92-42-99264000',
    email: 'wasiq.ahmed@lgh.gov.pk',
    consultationFee: 1700,
    rating: 4.7,
    reviews: 267,
    availableTime: '10:00 AM - 6:00 PM',
    specialties: ['ENT', 'sore throat', 'ear infection', 'runny nose', 'sneezing', 'throat pain'],
    conditions: ['otitis media', 'pharyngitis', 'sinusitis', 'rhinitis', 'tinnitus'],
    latitude: 31.5724,
    longitude: 74.3139,
  },
  {
    id: 'doc_016',
    name: 'Dr. Amina Shafi',
    specialization: 'ENT Specialist',
    qualification: 'MBBS, MS ENT, FCPS',
    experience: 12,
    hospital: 'Ziauddin Hospital',
    location: 'Clifton',
    city: 'Karachi',
    area: 'Clifton Block 4',
    phone: '+92-21-35868000',
    email: 'amina.shafi@ziauddin.edu.pk',
    consultationFee: 1600,
    rating: 4.4,
    reviews: 134,
    availableTime: '9:00 AM - 12:00 PM, 3:00 PM - 6:00 PM',
    specialties: ['ENT', 'sore throat', 'ear infection', 'runny nose', 'sneezing'],
    conditions: ['pharyngitis', 'otitis media', 'sinusitis', 'ear pain', 'rhinitis'],
    latitude: 24.7746,
    longitude: 67.0421,
  },
];

// Get doctors by specialization
export const getDoctorsBySpecialization = (specialization: string): DoctorInfo[] => {
  return doctorsDatabase.filter(doc =>
    doc.specialization.toLowerCase().includes(specialization.toLowerCase())
  );
};

// Get doctors by condition
export const getDoctorsByCondition = (condition: string): DoctorInfo[] => {
  const normalizedCondition = condition.toLowerCase().trim();
  return doctorsDatabase.filter(doc =>
    doc.conditions.some(c => c.toLowerCase().includes(normalizedCondition)) ||
    doc.specialties.some(s => s.toLowerCase().includes(normalizedCondition))
  );
};

// Get doctors by city
export const getDoctorsByCity = (city: string): DoctorInfo[] => {
  return doctorsDatabase.filter(doc =>
    doc.city.toLowerCase() === city.toLowerCase()
  );
};

// Get doctors by area
export const getDoctorsByArea = (area: string): DoctorInfo[] => {
  return doctorsDatabase.filter(doc =>
    doc.area.toLowerCase() === area.toLowerCase()
  );
};

// Get nearby doctors (within 5km radius)
export const getNearbyDoctors = (latitude: number, longitude: number, radiusKm: number = 5): Array<DoctorInfo & { distance: number }> => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const nearbyDoctors = doctorsDatabase
    .map(doc => {
      const dLat = toRad(doc.latitude - latitude);
      const dLon = toRad(doc.longitude - longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(latitude)) * Math.cos(toRad(doc.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return { ...doc, distance };
    })
    .filter(doc => doc.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);

  return nearbyDoctors;
};

// Get doctor by ID
export const getDoctorById = (id: string): DoctorInfo | undefined => {
  return doctorsDatabase.find(doc => doc.id === id);
};

// Get doctors by multiple conditions with scoring
export const recommendDoctorsByConditions = (conditions: string[], city?: string): DoctorInfo[] => {
  const normalizedConditions = conditions.map(c => c.toLowerCase().trim());
  
  let filtered = doctorsDatabase;
  if (city) {
    filtered = filtered.filter(doc => doc.city.toLowerCase() === city.toLowerCase());
  }

  const scored = filtered.map(doctor => {
    let score = 0;
    normalizedConditions.forEach(condition => {
      if (doctor.conditions.some(c => c.toLowerCase().includes(condition))) score += 2;
      if (doctor.specialties.some(s => s.toLowerCase().includes(condition))) score += 1;
    });
    return { doctor, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.doctor);
};
