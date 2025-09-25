export interface User {
  id: string;
  nom: string;
  prenom: string;
  role: 'Secretaire' | 'Infirmiere' | 'Medecin_Chef';
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt : string;
}

export interface LoginResponse {
    email: string;
    token: string;
    id: number;
}

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  role: 'Secretaire' | 'Infirmiere' | 'Medecin_Chef';
  email: string;
  password: string;
}

export interface RegisterUserResponse {
    user: User;
    message: string;
    token?: string;
}

export interface Patient {
  id: string;
  patientNumber: string;
  prenom: string;
  nom: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  address: string;
  phone: string;
  email?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  consultationDate: string;
  consultationReason: string;
  diagnosis: string;
  treatment: string;
  dosage: string;
  notes?: string;
  doctorId: string;
  nurseId?: string;
  vitals?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    weight?: number;
    height?: number;
  };
}

export interface PregnancyRecord {
  id: string;
  patientId: string;
  pregnancyNumber: number;
  startDate: string;
  expectedDueDate: string;
  status: 'active' | 'completed' | 'terminated';
  visits: PregnancyVisit[];
}

export interface PregnancyVisit {
  id: string;
  visitDate: string;
  gestationalWeek: number;
  weight: number;
  bloodPressure: string;
  notes: string;
  doctorId: string;
}

export interface MenstrualCycleRecord {
  id: string;
  patientId: string;
  cycleStartDate: string;
  cycleLength: number;
  notes?: string;
}

export interface ChronicCondition {
  id: string;
  patientId: string;
  condition: string;
  diagnosisDate: string;
  status: 'active' | 'remission' | 'cured';
  medications: string[];
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'monthly' | 'annual' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  data: {
    newPatients: number;
    totalConsultations: number;
    minorPatients: number;
    majorPatients: number;
    commonDiagnoses: { diagnosis: string; count: number }[];
  };
  generatedAt: string;
  generatedBy: string;
}