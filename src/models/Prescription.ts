import mongoose, { Document, Schema } from 'mongoose';

export interface IPrescriptionFile {
  fileName: string;
  mimeType: string;
  url: string;
  size: number;
}

export interface IPrescription extends Document {
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes?: string;
  files: IPrescriptionFile[];
  status: 'pending' | 'verified' | 'rejected';
}

const PrescriptionFileSchema = new Schema<IPrescriptionFile>({
  fileName: { type: String, required: true },
  mimeType: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
});

const PrescriptionSchema = new Schema<IPrescription>(
  {
    userId: { type: String },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    notes: { type: String },
    files: { type: [PrescriptionFileSchema], required: true },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Prescription || mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
