export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function validateEmail(email: string): ValidationError | null {
  if (!email) {
    return { field: 'email', message: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' };
  }
  return null;
}

export function validatePassword(password: string, fieldName: string = 'password'): ValidationError | null {
  if (!password) {
    return { field: fieldName, message: 'Password is required' };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { field: fieldName, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return { 
      field: fieldName, 
      message: 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)' 
    };
  }
  return null;
}

export function validateName(name: string): ValidationError | null {
  if (!name) {
    return { field: 'name', message: 'Full name is required' };
  }
  if (name.trim().length < 2) {
    return { field: 'name', message: 'Name must be at least 2 characters' };
  }
  if (name.trim().length > 100) {
    return { field: 'name', message: 'Name must be less than 100 characters' };
  }
  return null;
}

export function validatePhone(phone: string): ValidationError | null {
  if (!phone) return null; // optional field
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phone)) {
    return { field: 'phone', message: 'Please enter a valid phone number' };
  }
  return null;
}

export function validateSignUp(data: { name: string; email: string; password: string; confirmPassword: string }): ValidationResult {
  const errors: ValidationError[] = [];

  const nameError = validateName(data.name);
  if (nameError) errors.push(nameError);

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push(passwordError);

  if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSignIn(data: { email: string; password: string }): ValidationResult {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
