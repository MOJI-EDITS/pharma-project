// Extended session types for NextAuth
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: 'user' | 'admin';
    emailVerified?: boolean;
    phone?: string;
    address?: string;
    lastLogin?: Date;
    accountStatus?: 'active' | 'suspended' | 'deleted';
  }

  interface Session extends DefaultSession {
    // Session already has user from DefaultSession
  }

  interface JWT {
    role?: 'user' | 'admin';
    email?: string;
    emailVerified?: boolean;
  }
}

// API Response Types
export interface ApiResponse<T = any> {
  ok: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Auth Types
export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
}

// User Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Email Types
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

// Rate Limit Types
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Form State Types
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isLoading: boolean;
  error?: string;
  success?: string;
}
