export interface IProduct {
  _id: string;
  name: string;
  genericName: string;
  description: string;
  detailedDescription: string;
  category: string;
  subCategory?: string;
  manufacturer: string;
  form: string;
  strength: string;
  packageSize: string;
  price: number;
  originalPrice?: number;
  images: string[];
  indications: string[];
  dosageInstructions: string;
  sideEffects: string[];
  precautions: string[];
  contraindications: string[];
  storageInstructions: string;
  isPrescription: boolean;
  isAvailable: boolean;
  stockQuantity: number;
  sku: string;
  barcode?: string;
  therapeuticClass: string;
  activeIngredients: {
    name: string;
    strength: string;
  }[];
  tags: string[];
  rating?: number;
  reviewCount?: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}