import { NextResponse } from 'next/server';
import { inMemoryStore } from '@/lib/in-memory-store';
import { recommendMedicinesBySymptoms, medicinesDatabase, MedicineInfo } from '@/lib/medicines-database';
import { recommendDoctorsByConditions, DoctorInfo } from '@/lib/doctors-database';

interface RecommendationRequest {
  symptoms: string[];
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: string;
  location?: string;
  city?: string;
}

interface DetailedRecommendation {
  medicine: MedicineInfo;
  matchScore: number;
  reasoning: string;
  precautions: string[];
}

interface DoctorRecommendation {
  doctor: DoctorInfo;
  matchScore: number;
  reason: string;
}

// Analyze symptoms and recommend medicines + doctors
export async function POST(request: Request) {
  try {
    const body = await request.json() as RecommendationRequest;
    const { symptoms, severity = 'mild', duration, city } = body;

    if (!symptoms || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one symptom' },
        { status: 400 }
      );
    }

    // Get medicine recommendations
    const recommendedMedicines = recommendMedicinesBySymptoms(symptoms);

    // Get doctor recommendations based on symptoms and location
    const recommendedDoctors = recommendDoctorsByConditions(symptoms, city);

    if (recommendedMedicines.length === 0 && recommendedDoctors.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [],
        doctors: [],
        response: 'No specific medicines or doctors found for the provided symptoms. Please consult a healthcare professional.',
        disclaimer: 'This is an AI-powered recommendation system. Always consult a healthcare professional before taking any medicine.',
      });
    }

    // Create detailed medicine recommendations with reasoning
    const detailedRecommendations: DetailedRecommendation[] = recommendedMedicines
      .slice(0, 5)
      .map((medicine) => {
        const matchingSymptoms = symptoms.filter(s =>
          medicine.symptoms.some(ms => ms.toLowerCase().includes(s.toLowerCase())) ||
          medicine.conditions.some(c => c.toLowerCase().includes(s.toLowerCase()))
        );

        const matchScore = matchingSymptoms.length > 0 ? (matchingSymptoms.length / symptoms.length) * 100 : 50;
        const precautions = [
          medicine.isPrescriptionOnly && '⚠️ Prescription required',
          medicine.sideEffects.length > 0 && `Possible side effects: ${medicine.sideEffects.join(', ')}`,
          medicine.contraindications.length > 0 && `Not for: ${medicine.contraindications.join(', ')}`,
          'Take as directed by healthcare professional',
        ].filter(Boolean) as string[];

        return {
          medicine,
          matchScore,
          reasoning: matchingSymptoms.length > 0 ? `Recommended for: ${matchingSymptoms.join(', ')}. Dosage: ${medicine.dosage}, Frequency: ${medicine.frequency}` : `May help with your symptoms. Dosage: ${medicine.dosage}, Frequency: ${medicine.frequency}`,
          precautions,
        };
      });

    // Create detailed doctor recommendations
    const detailedDoctorRecommendations: DoctorRecommendation[] = recommendedDoctors
      .slice(0, 3)
      .map((doctor) => {
        const matchingConditions = symptoms.filter(s =>
          doctor.conditions.some(c => c.toLowerCase().includes(s.toLowerCase())) ||
          doctor.specialties.some(sp => sp.toLowerCase().includes(s.toLowerCase()))
        );

        const matchScore = matchingConditions.length > 0 ? (matchingConditions.length / symptoms.length) * 100 : 50;

        return {
          doctor,
          matchScore,
          reason: `${doctor.specialization} specializing in ${matchingConditions.join(', ')}. Located in ${doctor.location}, ${doctor.city}. Rating: ${doctor.rating}/5.0`,
        };
      });

    // Generate AI response with both medicines and doctors
    const responseText = generateRecommendationResponse(
      detailedRecommendations,
      detailedDoctorRecommendations,
      symptoms,
      severity,
      duration
    );

    return NextResponse.json({
      success: true,
      recommendations: detailedRecommendations,
      doctors: detailedDoctorRecommendations,
      response: responseText,
      disclaimer: 'This is an AI-powered recommendation system. Always consult a healthcare professional before taking any medicine. These recommendations are not a substitute for professional medical advice.',
    });
  } catch (error) {
    console.error('AI recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

// Generate detailed AI response with medicines and doctors
function generateRecommendationResponse(
  recommendations: DetailedRecommendation[],
  doctorRecommendations: DoctorRecommendation[],
  symptoms: string[],
  severity: string,
  duration?: string
): string {
  const lines: string[] = [];

  lines.push(`Based on your reported symptoms (${symptoms.join(', ')}), here are my comprehensive recommendations:\n`);

  // Medicine recommendations
  lines.push('**💊 Recommended Medicines:**');
  recommendations.forEach((rec, index) => {
    lines.push(`${index + 1}. **${rec.medicine.name} (${rec.medicine.strength})**`);
    lines.push(`   • Match Score: ${rec.matchScore.toFixed(0)}%`);
    lines.push(`   • ${rec.reasoning}`);
    lines.push(`   • Form: ${rec.medicine.form}`);
    lines.push(`   • Price: Rs${rec.medicine.price}`);
    lines.push(`   • Prescription Required: ${rec.medicine.isPrescriptionOnly ? 'Yes' : 'No'}`);
    lines.push('');
  });

  // Doctor recommendations
  if (doctorRecommendations.length > 0) {
    lines.push('\n**👨‍⚕️ Recommended Doctors:**');
    doctorRecommendations.forEach((rec, index) => {
      lines.push(`${index + 1}. **Dr. ${rec.doctor.name}** (${rec.doctor.specialization})`);
      lines.push(`   • Match Score: ${rec.matchScore.toFixed(0)}%`);
      lines.push(`   • Experience: ${rec.doctor.experience} years`);
      lines.push(`   • Hospital: ${rec.doctor.hospital}`);
      lines.push(`   • Location: ${rec.doctor.location}, ${rec.doctor.city}`);
      lines.push(`   • Consultation Fee: Rs${rec.doctor.consultationFee}`);
      lines.push(`   • Rating: ${rec.doctor.rating}/5.0 (${rec.doctor.reviews} reviews)`);
      lines.push(`   • Available: ${rec.doctor.availableTime}`);
      lines.push(`   • Contact: ${rec.doctor.phone}`);
      lines.push('');
    });
  }

  lines.push('\n**Important Guidelines:**');
  lines.push('• Take medication exactly as prescribed');
  lines.push('• Do not skip doses or stop prematurely');
  lines.push('• Report any severe side effects immediately');
  lines.push('• Keep medicines away from children');
  lines.push(`• Medication duration: typically ${duration || '3-7 days'}`);
  lines.push('• Consult your doctor if symptoms persist after treatment');
  if (doctorRecommendations.length > 0) {
    lines.push('• Consider consulting the recommended doctors for prescription medications');
  }

  lines.push('\n**Disclaimer:**');
  lines.push(
    'This recommendation is generated by AI and should not replace professional medical consultation. ' +
    'Always consult with a qualified healthcare professional before starting any medication, especially if you have ' +
    'existing medical conditions, are pregnant/nursing, or are taking other medications.'
  );

  return lines.join('\n');
}

