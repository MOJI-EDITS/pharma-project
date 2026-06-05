import { IProduct } from '@/lib/types/Product';
import mongoose, { Document, Schema } from 'mongoose';

export interface IMongooseProduct extends Omit<IProduct, '_id'>, Document {
  _id: string;
}

const ProductSchema: Schema<IMongooseProduct> = new Schema(
  {
    // allow storing provided _id as string when creating from mock data
    _id: {
      type: String,
      required: true,
    },
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
    // make category open-ended to support mock categories like 'Baby Care', etc.
    category: {
      type: String,
      required: true,
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
    // allow flexible form values (item names in mock data use 'Item', 'Wipes', etc.)
    form: {
      type: String,
      required: true,
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
    isPrescription: {
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

export default mongoose.models.Product || mongoose.model<IMongooseProduct>('Product', ProductSchema);