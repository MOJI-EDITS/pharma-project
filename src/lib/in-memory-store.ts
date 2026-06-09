// Prescription and Medicine recommendation types
interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  notes?: string;
}

interface Prescription {
  id: string;
  userId: string;
  symptoms: string[];
  medicines: PrescriptionItem[];
  doctorNotes?: string;
  aiRecommended: boolean;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: number;
  expiryDate?: number;
  refillsRemaining: number;
}

// In-memory user storage for authentication (development/testing only)
interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string; // bcrypt hashed
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: number;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: number;
  lastLogin?: number;
  accountStatus: 'active' | 'suspended' | 'deleted';
  prescriptionHistory: string[]; // Array of prescription IDs
  createdAt: number;
  updatedAt: number;
}

// In-memory databases
let users: Map<string, StoredUser> = new Map();
let prescriptions: Map<string, Prescription> = new Map();

export const inMemoryStore = {
  // User operations
  async findUserByEmail(email: string): Promise<StoredUser | null> {
    const user = Array.from(users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    return user || null;
  },

  async findUserById(id: string): Promise<StoredUser | null> {
    return users.get(id) || null;
  },

  async createUser(userData: Omit<StoredUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<StoredUser> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const user: StoredUser = {
      ...userData,
      id,
      prescriptionHistory: userData.prescriptionHistory || [],
      createdAt: now,
      updatedAt: now,
    };
    users.set(id, user);
    return user;
  },

  async updateUser(id: string, updates: Partial<StoredUser>): Promise<StoredUser | null> {
    const user = users.get(id);
    if (!user) return null;

    const updated: StoredUser = {
      ...user,
      ...updates,
      id: user.id, // Ensure ID doesn't change
      createdAt: user.createdAt, // Ensure creation date doesn't change
      updatedAt: Date.now(),
    };
    users.set(id, updated);
    return updated;
  },

  async deleteUser(id: string): Promise<boolean> {
    return users.delete(id);
  },

  async findByVerificationToken(token: string): Promise<StoredUser | null> {
    const user = Array.from(users.values()).find(
      (u) => u.emailVerificationToken === token && u.emailVerificationTokenExpiry! > Date.now()
    );
    return user || null;
  },

  async findByResetToken(token: string): Promise<StoredUser | null> {
    const user = Array.from(users.values()).find(
      (u) => u.passwordResetToken === token && u.passwordResetTokenExpiry! > Date.now()
    );
    return user || null;
  },

  // Admin operations
  async getAllUsers(): Promise<StoredUser[]> {
    return Array.from(users.values());
  },

  async getUserCount(): Promise<number> {
    return users.size;
  },

  // Development only: Clear all users
  async clearAllUsers(): Promise<void> {
    users.clear();
  },

  // Development only: Get all users data
  getAllUsersData(): StoredUser[] {
    return Array.from(users.values());
  },

  // Prescription operations
  async createPrescription(
    userId: string,
    prescriptionData: Omit<Prescription, 'id' | 'createdAt'>
  ): Promise<Prescription> {
    const id = `rx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const prescription: Prescription = {
      ...prescriptionData,
      id,
      createdAt: Date.now(),
    };
    prescriptions.set(id, prescription);

    // Add prescription ID to user's history
    const user = users.get(userId);
    if (user) {
      user.prescriptionHistory = user.prescriptionHistory || [];
      user.prescriptionHistory.push(id);
      user.updatedAt = Date.now();
    }

    return prescription;
  },

  async getPrescriptionById(id: string): Promise<Prescription | null> {
    return prescriptions.get(id) || null;
  },

  async getUserPrescriptions(userId: string): Promise<Prescription[]> {
    const user = users.get(userId);
    if (!user || !user.prescriptionHistory) return [];
    
    return user.prescriptionHistory
      .map(rxId => prescriptions.get(rxId))
      .filter((rx): rx is Prescription => rx !== undefined);
  },

  async updatePrescription(id: string, updates: Partial<Prescription>): Promise<Prescription | null> {
    const prescription = prescriptions.get(id);
    if (!prescription) return null;

    const updated: Prescription = {
      ...prescription,
      ...updates,
      id: prescription.id,
      createdAt: prescription.createdAt,
    };
    prescriptions.set(id, updated);
    return updated;
  },

  async deletePrescription(id: string): Promise<boolean> {
    return prescriptions.delete(id);
  },

  async getActivePrescriptions(userId: string): Promise<Prescription[]> {
    const allPrescriptions = await inMemoryStore.getUserPrescriptions(userId);
    return allPrescriptions.filter(rx => rx.status === 'active');
  },

  // Development only: Clear all prescriptions
  async clearAllPrescriptions(): Promise<void> {
    prescriptions.clear();
  },

  // Development only: Get all prescriptions
  getAllPrescriptionsData(): Prescription[] {
    return Array.from(prescriptions.values());
  },
};

export type { StoredUser, Prescription, PrescriptionItem };
