// Comprehensive medicine database with symptom mapping
export interface MedicineInfo {
  id: string;
  name: string;
  genericName: string;
  category: string;
  strength: string;
  form: string;
  price: number;
  symptoms: string[];
  conditions: string[];
  dosage: string;
  frequency: string;
  duration: string;
  sideEffects: string[];
  contraindications: string[];
  interactions: string[];
  isPrescriptionOnly: boolean;
  manufacturer?: string;
  expiryInfo?: string;
}

// Comprehensive medicine database with accurate symptom mappings
export const medicinesDatabase: MedicineInfo[] = [
  // Pain Relief
  {
    id: 'med_001',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Pain Relief',
    strength: '500mg',
    form: 'Tablet',
    price: 50,
    symptoms: ['headache', 'fever', 'body ache', 'muscle pain', 'joint pain', 'toothache'],
    conditions: ['pain management', 'fever reduction', 'cold', 'flu'],
    dosage: '1-2 tablets',
    frequency: 'Every 4-6 hours',
    duration: '3-5 days max',
    sideEffects: ['nausea', 'dizziness', 'allergic reactions'],
    contraindications: ['liver disease', 'kidney disease'],
    interactions: ['warfarin', 'alcohol'],
    isPrescriptionOnly: false,
    manufacturer: 'Various',
  },
  {
    id: 'med_002',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'Pain Relief',
    strength: '400mg',
    form: 'Tablet',
    price: 80,
    symptoms: ['headache', 'migraine', 'body pain', 'fever', 'period pain', 'inflammation'],
    conditions: ['arthritis', 'back pain', 'muscle strain', 'flu'],
    dosage: '1 tablet',
    frequency: 'Every 6-8 hours',
    duration: '3-7 days',
    sideEffects: ['stomach upset', 'heartburn', 'dizziness'],
    contraindications: ['stomach ulcers', 'bleeding disorders'],
    interactions: ['aspirin', 'anticoagulants'],
    isPrescriptionOnly: false,
  },
  {
    id: 'med_003',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    category: 'Pain Relief',
    strength: '500mg',
    form: 'Tablet',
    price: 40,
    symptoms: ['headache', 'body pain', 'fever', 'cold'],
    conditions: ['pain management', 'fever', 'blood clotting prevention'],
    dosage: '1-2 tablets',
    frequency: 'Every 4-6 hours',
    duration: '3-5 days',
    sideEffects: ['stomach upset', 'bleeding', 'allergic reactions'],
    contraindications: ['bleeding disorders', 'stomach ulcers', 'asthma'],
    interactions: ['ibuprofen', 'warfarin'],
    isPrescriptionOnly: false,
  },

  // Antibiotics
  {
    id: 'med_004',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotics',
    strength: '500mg',
    form: 'Capsule',
    price: 200,
    symptoms: ['bacterial infection', 'sore throat', 'cough', 'ear infection', 'urinary tract infection'],
    conditions: ['throat infection', 'respiratory infection', 'skin infection', 'dental infection'],
    dosage: '1 capsule',
    frequency: '3 times daily',
    duration: '7-10 days',
    sideEffects: ['allergic reactions', 'diarrhea', 'nausea', 'rash'],
    contraindications: ['penicillin allergy'],
    interactions: ['methotrexate', 'oral contraceptives'],
    isPrescriptionOnly: true,
    manufacturer: 'Various',
  },
  {
    id: 'med_005',
    name: 'Azithromycin',
    genericName: 'Azithromycin Dihydrate',
    category: 'Antibiotics',
    strength: '250mg',
    form: 'Tablet',
    price: 350,
    symptoms: ['respiratory infection', 'cough', 'sore throat', 'pneumonia', 'bronchitis'],
    conditions: ['chest infection', 'throat infection', 'skin infection'],
    dosage: '1-2 tablets',
    frequency: 'Once daily',
    duration: '3-5 days',
    sideEffects: ['nausea', 'diarrhea', 'abdominal pain', 'headache'],
    contraindications: ['liver disease', 'macrolide allergy'],
    interactions: ['warfarin', 'digoxin'],
    isPrescriptionOnly: true,
  },

  // Antihistamines (Allergy Relief)
  {
    id: 'med_006',
    name: 'Cetirizine',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Antihistamine',
    strength: '10mg',
    form: 'Tablet',
    price: 120,
    symptoms: ['allergy', 'sneezing', 'runny nose', 'itchy eyes', 'skin rash', 'hives'],
    conditions: ['hay fever', 'allergic rhinitis', 'urticaria'],
    dosage: '1 tablet',
    frequency: 'Once daily',
    duration: 'As needed',
    sideEffects: ['drowsiness', 'dry mouth', 'headache'],
    contraindications: ['kidney disease', 'liver disease'],
    interactions: ['alcohol', 'CNS depressants'],
    isPrescriptionOnly: false,
  },
  {
    id: 'med_007',
    name: 'Loratadine',
    genericName: 'Loratadine',
    category: 'Antihistamine',
    strength: '10mg',
    form: 'Tablet',
    price: 150,
    symptoms: ['allergy', 'sneezing', 'itching', 'allergic reactions', 'hives'],
    conditions: ['hay fever', 'allergic reactions', 'urticaria'],
    dosage: '1 tablet',
    frequency: 'Once daily',
    duration: 'As needed',
    sideEffects: ['dry mouth', 'headache', 'drowsiness (rare)'],
    contraindications: ['liver disease'],
    interactions: ['alcohol'],
    isPrescriptionOnly: false,
  },

  // Cough & Cold
  {
    id: 'med_008',
    name: 'Cough Syrup',
    genericName: 'Dextromethorphan',
    category: 'Cold & Cough',
    strength: '10mg/5ml',
    form: 'Syrup',
    price: 90,
    symptoms: ['cough', 'dry cough', 'throat irritation'],
    conditions: ['common cold', 'bronchitis', 'flu'],
    dosage: '1-2 teaspoons',
    frequency: '3-4 times daily',
    duration: '5-7 days',
    sideEffects: ['dizziness', 'drowsiness', 'nausea'],
    contraindications: ['liver disease', 'respiratory depression'],
    interactions: ['MAOIs', 'SSRIs'],
    isPrescriptionOnly: false,
  },
  {
    id: 'med_009',
    name: 'Throat Lozenges',
    genericName: 'Menthol',
    category: 'Cold & Cough',
    strength: '5mg',
    form: 'Lozenge',
    price: 60,
    symptoms: ['sore throat', 'throat pain', 'cough', 'throat irritation'],
    conditions: ['sore throat', 'pharyngitis'],
    dosage: '1 lozenge',
    frequency: 'Every 2-4 hours',
    duration: 'As needed',
    sideEffects: ['none significant'],
    contraindications: ['none'],
    interactions: [],
    isPrescriptionOnly: false,
  },

  // Gastrointestinal
  {
    id: 'med_010',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    category: 'Gastrointestinal',
    strength: '20mg',
    form: 'Capsule',
    price: 180,
    symptoms: ['acid reflux', 'heartburn', 'stomach pain', 'indigestion', 'gastric ulcer'],
    conditions: ['GERD', 'peptic ulcer disease', 'acid reflux'],
    dosage: '1 capsule',
    frequency: 'Once daily (morning)',
    duration: '7-14 days or longer',
    sideEffects: ['headache', 'diarrhea', 'nausea', 'abdominal pain'],
    contraindications: ['none significant'],
    interactions: ['clopidogrel', 'digoxin'],
    isPrescriptionOnly: false,
  },
  {
    id: 'med_011',
    name: 'Metoclopramide',
    genericName: 'Metoclopramide',
    category: 'Gastrointestinal',
    strength: '10mg',
    form: 'Tablet',
    price: 100,
    symptoms: ['nausea', 'vomiting', 'stomach discomfort', 'indigestion'],
    conditions: ['nausea', 'vomiting', 'gastroparesis'],
    dosage: '1 tablet',
    frequency: '3 times daily',
    duration: '2-4 weeks',
    sideEffects: ['drowsiness', 'headache', 'diarrhea'],
    contraindications: ['GI obstruction', 'pheochromocytoma'],
    interactions: ['digoxin', 'alcohol'],
    isPrescriptionOnly: true,
  },
  {
    id: 'med_012',
    name: 'Loperamide',
    genericName: 'Loperamide',
    category: 'Gastrointestinal',
    strength: '2mg',
    form: 'Tablet',
    price: 70,
    symptoms: ['diarrhea', 'loose stools', 'abdominal pain from diarrhea'],
    conditions: ['acute diarrhea', 'traveler\'s diarrhea'],
    dosage: '1-2 tablets',
    frequency: 'After each loose stool',
    duration: '2-3 days',
    sideEffects: ['constipation', 'abdominal bloating', 'dizziness'],
    contraindications: ['bloody diarrhea', 'severe colitis'],
    interactions: [],
    isPrescriptionOnly: false,
  },

  // Vitamins & Supplements
  {
    id: 'med_013',
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    category: 'Vitamins',
    strength: '1000 IU',
    form: 'Tablet',
    price: 120,
    symptoms: ['weakness', 'fatigue', 'bone pain', 'muscle weakness'],
    conditions: ['vitamin D deficiency', 'bone health', 'immunity boost'],
    dosage: '1 tablet',
    frequency: 'Once daily',
    duration: 'Ongoing',
    sideEffects: ['none at recommended doses'],
    contraindications: ['hypercalcemia'],
    interactions: [],
    isPrescriptionOnly: false,
  },
  {
    id: 'med_014',
    name: 'Vitamin C',
    genericName: 'Ascorbic Acid',
    category: 'Vitamins',
    strength: '500mg',
    form: 'Tablet',
    price: 80,
    symptoms: ['weakness', 'immunity issues', 'slow wound healing'],
    conditions: ['immunity support', 'cold prevention', 'wound healing'],
    dosage: '1 tablet',
    frequency: 'Once or twice daily',
    duration: 'Ongoing',
    sideEffects: ['kidney stones (at high doses)', 'diarrhea'],
    contraindications: ['kidney stones history'],
    interactions: [],
    isPrescriptionOnly: false,
  },
  {
    id: 'med_015',
    name: 'Multivitamin',
    genericName: 'Multivitamin & Mineral Complex',
    category: 'Vitamins',
    strength: 'Various',
    form: 'Tablet',
    price: 150,
    symptoms: ['general weakness', 'fatigue', 'poor nutrition'],
    conditions: ['nutritional deficiency', 'general health', 'energy boost'],
    dosage: '1 tablet',
    frequency: 'Once daily',
    duration: 'Ongoing',
    sideEffects: ['nausea (on empty stomach)', 'staining of teeth'],
    contraindications: ['iron overload disorders'],
    interactions: [],
    isPrescriptionOnly: false,
  },

  // Skin Care
  {
    id: 'med_016',
    name: 'Hydrocortisone Cream',
    genericName: 'Hydrocortisone',
    category: 'Skin Care',
    strength: '1%',
    form: 'Cream',
    price: 110,
    symptoms: ['itching', 'rash', 'skin inflammation', 'dermatitis', 'eczema'],
    conditions: ['eczema', 'dermatitis', 'skin rash', 'allergic skin reactions'],
    dosage: 'Small amount',
    frequency: '2-3 times daily',
    duration: '7 days max',
    sideEffects: ['skin atrophy (with prolonged use)', 'burning'],
    contraindications: ['bacterial/viral skin infections'],
    interactions: [],
    isPrescriptionOnly: false,
  },
  {
    id: 'med_017',
    name: 'Anti-Acne Cream',
    genericName: 'Benzoyl Peroxide',
    category: 'Skin Care',
    strength: '2.5%',
    form: 'Cream',
    price: 200,
    symptoms: ['acne', 'pimples', 'blackheads', 'whiteheads'],
    conditions: ['acne vulgaris', 'bacterial skin infection'],
    dosage: 'Small amount',
    frequency: 'Once or twice daily',
    duration: 'Ongoing',
    sideEffects: ['dryness', 'redness', 'peeling', 'burning sensation'],
    contraindications: ['sensitive skin'],
    interactions: [],
    isPrescriptionOnly: false,
  },

  // Blood Pressure
  {
    id: 'med_018',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    category: 'Blood Pressure',
    strength: '10mg',
    form: 'Tablet',
    price: 250,
    symptoms: ['high blood pressure', 'hypertension'],
    conditions: ['hypertension', 'heart failure', 'heart disease'],
    dosage: '1 tablet',
    frequency: 'Once daily',
    duration: 'Ongoing',
    sideEffects: ['dry cough', 'dizziness', 'fatigue', 'headache'],
    contraindications: ['pregnancy', 'kidney disease'],
    interactions: ['potassium supplements', 'NSAIDs'],
    isPrescriptionOnly: true,
  },
  {
    id: 'med_019',
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    category: 'Blood Pressure',
    strength: '5mg',
    form: 'Tablet',
    price: 280,
    symptoms: ['high blood pressure', 'angina'],
    conditions: ['hypertension', 'coronary artery disease', 'angina'],
    dosage: '1 tablet',
    frequency: 'Once daily',
    duration: 'Ongoing',
    sideEffects: ['swelling in feet/ankles', 'headache', 'dizziness'],
    contraindications: ['cardiogenic shock'],
    interactions: ['grapefruit juice', 'simvastatin'],
    isPrescriptionOnly: true,
  },

  // Diabetes
  {
    id: 'med_020',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    category: 'Diabetes',
    strength: '500mg',
    form: 'Tablet',
    price: 220,
    symptoms: ['high blood sugar', 'diabetes'],
    conditions: ['type 2 diabetes', 'PCOS'],
    dosage: '1 tablet',
    frequency: '2-3 times daily with meals',
    duration: 'Ongoing',
    sideEffects: ['stomach upset', 'diarrhea', 'metallic taste', 'nausea'],
    contraindications: ['kidney disease', 'liver disease'],
    interactions: ['alcohol', 'contrast dye'],
    isPrescriptionOnly: true,
  },
];

// Symptom to medicine mapping for quick lookups
export const symptomToMedicines = (symptom: string): MedicineInfo[] => {
  const normalizedSymptom = symptom.toLowerCase().trim();
  return medicinesDatabase.filter(med =>
    med.symptoms.some(s => s.toLowerCase().includes(normalizedSymptom)) ||
    med.conditions.some(c => c.toLowerCase().includes(normalizedSymptom))
  );
};

// Get medicines by multiple symptoms with scoring
export const recommendMedicinesBySymptoms = (symptoms: string[]): MedicineInfo[] => {
  const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());
  
  const scored = medicinesDatabase.map(medicine => {
    let score = 0;
    normalizedSymptoms.forEach(symptom => {
      if (medicine.symptoms.some(s => s.toLowerCase().includes(symptom))) score += 2;
      if (medicine.conditions.some(c => c.toLowerCase().includes(symptom))) score += 1;
    });
    return { medicine, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.medicine);
};

// Get detailed medicine by ID
export const getMedicineById = (id: string): MedicineInfo | undefined => {
  return medicinesDatabase.find(med => med.id === id);
};

// Get medicines by category
export const getMedicinesByCategory = (category: string): MedicineInfo[] => {
  return medicinesDatabase.filter(med => med.category.toLowerCase() === category.toLowerCase());
};
