import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  genericName: string;
  description: string;
  detailedDescription: string;
  category: string;
  subCategory?: string;
  manufacturer: string;
  dosageForm: string;
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
  requiresPrescription: boolean;
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

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    genericName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    detailedDescription: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Analgesics',
        'Antibiotics',
        'Antihypertensives',
        'Antidiabetics',
        'Antidepressants',
        'Vitamins',
        'Supplements',
        'Cardiovascular',
        'Gastrointestinal',
        'Respiratory',
        'Dermatological',
        'Ophthalmic',
        'Other',
      ],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    dosageForm: {
      type: String,
      required: true,
      enum: [
        'Tablet',
        'Capsule',
        'Syrup',
        'Injection',
        'Ointment',
        'Cream',
        'Drops',
        'Inhaler',
        'Powder',
        'Solution',
        'Suspension',
        'Other',
      ],
    },
    strength: {
      type: String,
      required: true,
    },
    packageSize: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    images: [{
      type: String,
    }],
    indications: [{
      type: String,
    }],
    dosageInstructions: {
      type: String,
      required: true,
    },
    sideEffects: [{
      type: String,
    }],
    precautions: [{
      type: String,
    }],
    contraindications: [{
      type: String,
    }],
    storageInstructions: {
      type: String,
      required: true,
    },
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    barcode: {
      type: String,
    },
    therapeuticClass: {
      type: String,
      required: true,
    },
    activeIngredients: [{
      name: {
        type: String,
        required: true,
      },
      strength: {
        type: String,
        required: true,
      },
    }],
    tags: [{
      type: String,
    }],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);