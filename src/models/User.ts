import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, default: null },
  emailVerificationTokenExpiry: { type: Date, default: null },
  passwordResetToken: { type: String, default: null },
  passwordResetTokenExpiry: { type: Date, default: null },
  lastLogin: { type: Date, default: null },
  accountStatus: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);