export interface User {
  id: string;
  nom: string;
  prenom: string;
  role: 'Secretaire' | 'Infirmiere' | 'Medecin_Chef';
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

// Dans types.ts
export interface Patient {
  id: string | number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'Masculin' | 'Féminin';
  adresse?: string;
  patientNumber?: string;
  createdAt?: string;
  updatedAt?: string;
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
  id: string | number;
  patientId: string | number;
  medecinId: string | number;
  dateHeure: Date;
  motif: string;
  statut: 'PROGRAMME' | 'CONFIRME' | 'TERMINE' | 'ANNULE' | 'ABSENT';
  notes?: string | null;
  duree: number;
  patient?: {
    nom: string;
    prenom: string;
  };
  medecin?: {
    nom: string;
    prenom: string;
  };
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
export enum TypeGardeEnum {
  JOUR = 'JOUR',
  NUIT = 'NUIT',
  WEEK_END = 'WEEK_END'
}

export interface Garde {
  id: number;
  dateDebut: Date;
  dateFin: Date;
  medecinId: number;
  typeGarde: TypeGardeEnum;
  medecin?: {
    id: number;
    nom: string;
    prenom: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateGardeData {
  dateDebut: Date;
  dateFin: Date;
  medecinId: number;
  typeGarde: TypeGardeEnum;
}

export interface UpdateGardeData {
  dateDebut?: Date;
  dateFin?: Date;
  medecinId?: number;
  typeGarde?: TypeGardeEnum;
}