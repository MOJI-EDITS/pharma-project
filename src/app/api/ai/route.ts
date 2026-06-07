import { NextResponse } from "next/server";
import { productsData } from "@/lib/data/products";
import { IProduct } from "@/lib/types/Product";

interface AIRequest {
  prompt: string;
  prescriptionData?: string;
}

interface ProductRecommendation extends IProduct {
  matchReason: string;
}

export async function POST(request: Request) {
  const body = await request.json() as AIRequest;
  const { prompt, prescriptionData } = body;

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const fullInput = prescriptionData ? `${prompt}\n\nPrescription Data:\n${prescriptionData}` : prompt;
  const lowerInput = fullInput.toLowerCase();

  // Categorize the prescription/symptoms
  const recommendations: ProductRecommendation[] = [];

  // Pain Relief
  if (lowerInput.includes("headache") || lowerInput.includes("pain") || lowerInput.includes("fever") || 
      lowerInput.includes("body pain") || lowerInput.includes("joint pain")) {
    const painProducts = productsData.filter(p => 
      p.category.includes("Pain") || p.name.toLowerCase().includes("aspirin") || 
      p.name.toLowerCase().includes("ibuprofen") || p.category.includes("Medical Devices")
    ).slice(0, 3);
    
    painProducts.forEach(p => {
      recommendations.push({
        ...p,
        matchReason: "Recommended for pain relief"
      });
    });
  }

  // Antibiotics / Infection
  if (lowerInput.includes("infection") || lowerInput.includes("bacteria") || lowerInput.includes("throat") ||
      lowerInput.includes("antibiotics")) {
    const antibioticProducts = productsData.filter(p => 
      p.category.includes("Antibiotic") || p.name.toLowerCase().includes("antiseptic")
    ).slice(0, 2);
    
    antibioticProducts.forEach(p => {
      recommendations.push({
        ...p,
        matchReason: "Recommended for infection treatment"
      });
    });
  }

  // Allergies
  if (lowerInput.includes("allergy") || lowerInput.includes("sneeze") || lowerInput.includes("runny") || 
      lowerInput.includes("itch") || lowerInput.includes("allergic")) {
    const allergyProducts = productsData.filter(p => 
      p.category.includes("Allergy")
    ).slice(0, 3);
    
    allergyProducts.forEach(p => {
      recommendations.push({
        ...p,
        matchReason: "Recommended for allergy relief"
      });
    });
  }

  // Cold & Flu
  if (lowerInput.includes("cold") || lowerInput.includes("cough") || lowerInput.includes("flu") ||
      lowerInput.includes("sore throat")) {
    const coldProducts = productsData.filter(p => 
      p.category.includes("Cold") || p.category.includes("Throat") || p.name.toLowerCase().includes("cough")
    ).slice(0, 3);
    
    coldProducts.forEach(p => {
      recommendations.push({
        ...p,
        matchReason: "Recommended for cold and flu symptoms"
      });
    });
  }

  // Vitamins & Supplements
  if (lowerInput.includes("vitamin") || lowerInput.includes("supplement") || lowerInput.includes("weakness") ||
      lowerInput.includes("energy")) {
    const vitaminProducts = productsData.filter(p => 
      p.category.includes("Vitamin") || p.category.includes("Supplement")
    ).slice(0, 3);
    
    vitaminProducts.forEach(p => {
      recommendations.push({
        ...p,
        matchReason: "Recommended as nutritional support"
      });
    });
  }

  // Skin Care
  if (lowerInput.includes("skin") || lowerInput.includes("rash") || lowerInput.includes("acne") ||
      lowerInput.includes("dermatitis")) {
    const skinProducts = productsData.filter(p => 
      p.category.includes("Skin") || p.category.includes("Personal Care")
    ).slice(0, 3);
    
    skinProducts.forEach(p => {
      recommendations.push({
        ...p,
        matchReason: "Recommended for skin health"
      });
    });
  }

  // If no specific category matched, provide general guidance
  if (recommendations.length === 0) {
    return NextResponse.json({
      response: "Thank you for sharing your prescription. Please describe your symptoms or medical conditions in more detail (e.g., pain relief, allergy, cold, infection, vitamins, skin care) so I can recommend the most suitable products from our pharmacy.",
      products: []
    });
  }

  // Remove duplicates and limit to 5
  const uniqueRecommendations = Array.from(
    new Map(recommendations.map(p => [p._id, p])).values()
  ).slice(0, 5);

  const response = `Based on the prescription and symptoms provided, I recommend the following products:\n\n${
    uniqueRecommendations.map(p => `• ${p.name} (${p.strength}) - Rs${p.price}`).join("\n")
  }\n\nPlease consult with a healthcare professional before using any medication. All purchases require valid prescriptions for prescription-only items.`;

  return NextResponse.json({
    response,
    products: uniqueRecommendations.map(({ matchReason, ...p }) => p)
  });
}
