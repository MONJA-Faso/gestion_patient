import { User, Patient, MedicalRecord, PregnancyRecord, MenstrualCycleRecord, ChronicCondition, Appointment, Report } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'marie.dupont',
    firstName: 'Marie',
    lastName: 'Dupont',
    role: 'secretary',
    email: 'marie.dupont@medcare.fr',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    username: 'sophie.martin',
    firstName: 'Sophie',
    lastName: 'Martin',
    role: 'nurse',
    email: 'sophie.martin@medcare.fr',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '3',
    username: 'dr.bernard',
    firstName: 'Jean',
    lastName: 'Bernard',
    role: 'doctor',
    email: 'jean.bernard@medcare.fr',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '4',
    username: 'claire.rousseau',
    firstName: 'Claire',
    lastName: 'Rousseau',
    role: 'nurse',
    email: 'claire.rousseau@medcare.fr',
    isActive: true,
    createdAt: '2024-02-01T08:00:00Z'
  },
  {
    id: '5',
    username: 'dr.martinez',
    firstName: 'Carlos',
    lastName: 'Martinez',
    role: 'doctor',
    email: 'carlos.martinez@medcare.fr',
    isActive: true,
    createdAt: '2024-02-10T08:00:00Z'
  }
];

export const mockPatients: Patient[] = [
  {
    id: '1',
    patientNumber: 'PAT-2024-001',
    firstName: 'Emma',
    lastName: 'Moreau',
    gender: 'female',
    dateOfBirth: '1985-03-15',
    address: '123 Rue de la Paix, 75001 Paris',
    phone: '01 23 45 67 89',
    email: 'emma.moreau@email.fr',
    emergencyContact: {
      name: 'Pierre Moreau',
      phone: '01 23 45 67 90',
      relationship: 'Époux'
    },
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '2',
    patientNumber: 'PAT-2024-002',
    firstName: 'Lucas',
    lastName: 'Dubois',
    gender: 'male',
    dateOfBirth: '1992-07-22',
    address: '45 Avenue des Champs, 69001 Lyon',
    phone: '04 56 78 90 12',
    emergencyContact: {
      name: 'Marie Dubois',
      phone: '04 56 78 90 13',
      relationship: 'Mère'
    },
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: '2024-01-22T14:30:00Z'
  },
  {
    id: '3',
    patientNumber: 'PAT-2024-003',
    firstName: 'Camille',
    lastName: 'Rousseau',
    gender: 'female',
    dateOfBirth: '1978-11-08',
    address: '78 Boulevard Saint-Michel, 33000 Bordeaux',
    phone: '05 67 89 01 23',
    emergencyContact: {
      name: 'Thomas Rousseau',
      phone: '05 67 89 01 24',
      relationship: 'Époux'
    },
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: '4',
    patientNumber: 'PAT-2024-004',
    firstName: 'Antoine',
    lastName: 'Leroy',
    gender: 'male',
    dateOfBirth: '2010-05-12',
    address: '12 Rue Victor Hugo, 59000 Lille',
    phone: '03 45 67 89 01',
    emergencyContact: {
      name: 'Catherine Leroy',
      phone: '03 45 67 89 02',
      relationship: 'Mère'
    },
    createdAt: '2024-02-05T11:20:00Z',
    updatedAt: '2024-02-05T11:20:00Z'
  },
  {
    id: '5',
    patientNumber: 'PAT-2024-005',
    firstName: 'Isabelle',
    lastName: 'Durand',
    gender: 'female',
    dateOfBirth: '1995-09-18',
    address: '89 Rue de la République, 13000 Marseille',
    phone: '04 91 23 45 67',
    email: 'isabelle.durand@email.fr',
    emergencyContact: {
      name: 'Michel Durand',
      phone: '04 91 23 45 68',
      relationship: 'Père'
    },
    createdAt: '2024-02-08T16:45:00Z',
    updatedAt: '2024-02-08T16:45:00Z'
  }
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    consultationDate: '2024-01-25T14:00:00Z',
    consultationReason: 'Contrôle de grossesse - 12ème semaine',
    diagnosis: 'Grossesse normale',
    treatment: 'Acide folique',
    dosage: '5mg par jour',
    notes: 'Patiente en bonne santé, grossesse se déroule normalement',
    doctorId: '3',
    nurseId: '2',
    vitals: {
      temperature: 36.5,
      bloodPressure: '120/80',
      heartRate: 75,
      weight: 62.5,
      height: 165
    }
  },
  {
    id: '2',
    patientId: '2',
    consultationDate: '2024-02-03T10:30:00Z',
    consultationReason: 'Douleurs abdominales',
    diagnosis: 'Gastrite aiguë',
    treatment: 'Oméprazole',
    dosage: '20mg matin et soir pendant 7 jours',
    notes: 'Recommandations diététiques données',
    doctorId: '3',
    vitals: {
      temperature: 37.2,
      bloodPressure: '130/85',
      heartRate: 82,
      weight: 75.0,
      height: 178
    }
  },
  {
    id: '3',
    patientId: '3',
    consultationDate: '2024-02-10T09:15:00Z',
    consultationReason: 'Contrôle hypertension',
    diagnosis: 'Hypertension artérielle contrôlée',
    treatment: 'Lisinopril',
    dosage: '10mg par jour',
    notes: 'Tension bien contrôlée, continuer le traitement',
    doctorId: '5',
    nurseId: '4',
    vitals: {
      temperature: 36.8,
      bloodPressure: '135/85',
      heartRate: 68,
      weight: 68.2,
      height: 162
    }
  },
  {
    id: '4',
    patientId: '4',
    consultationDate: '2024-02-12T15:30:00Z',
    consultationReason: 'Vaccination de routine',
    diagnosis: 'Mise à jour vaccins',
    treatment: 'Vaccin DTP',
    dosage: 'Injection unique',
    notes: 'Vaccination bien tolérée, rappel dans 5 ans',
    doctorId: '3',
    nurseId: '2',
    vitals: {
      temperature: 36.6,
      bloodPressure: '110/70',
      heartRate: 85,
      weight: 45.0,
      height: 155
    }
  },
  {
    id: '5',
    patientId: '5',
    consultationDate: '2024-02-15T11:00:00Z',
    consultationReason: 'Consultation gynécologique',
    diagnosis: 'Examen normal',
    treatment: 'Aucun',
    dosage: '',
    notes: 'Examen gynécologique normal, prochain contrôle dans 1 an',
    doctorId: '5',
    nurseId: '4',
    vitals: {
      temperature: 36.7,
      bloodPressure: '115/75',
      heartRate: 72,
      weight: 58.5,
      height: 168
    }
  }
];

export const mockPregnancyRecords: PregnancyRecord[] = [
  {
    id: '1',
    patientId: '1',
    pregnancyNumber: 1,
    startDate: '2023-11-01',
    expectedDueDate: '2024-07-28',
    status: 'active',
    visits: [
      {
        id: '1',
        visitDate: '2024-01-25T14:00:00Z',
        gestationalWeek: 12,
        weight: 62.5,
        bloodPressure: '120/80',
        notes: 'Première échographie réalisée, tout est normal',
        doctorId: '3'
      },
      {
        id: '2',
        visitDate: '2024-02-15T14:00:00Z',
        gestationalWeek: 16,
        weight: 64.0,
        bloodPressure: '118/78',
        notes: 'Développement normal du fœtus',
        doctorId: '3'
      }
    ]
  }
];

export const mockMenstrualRecords: MenstrualCycleRecord[] = [
  {
    id: '1',
    patientId: '3',
    cycleStartDate: '2024-01-15',
    cycleLength: 28,
    notes: 'Cycle régulier'
  },
  {
    id: '2',
    patientId: '3',
    cycleStartDate: '2024-02-12',
    cycleLength: 29,
    notes: 'Légère variation normale'
  },
  {
    id: '3',
    patientId: '5',
    cycleStartDate: '2024-01-20',
    cycleLength: 26,
    notes: 'Cycle court mais régulier'
  },
  {
    id: '4',
    patientId: '5',
    cycleStartDate: '2024-02-15',
    cycleLength: 27,
    notes: 'Cycle normal'
  }
];

export const mockChronicConditions: ChronicCondition[] = [
  {
    id: '1',
    patientId: '3',
    condition: 'Hypertension artérielle',
    diagnosisDate: '2020-05-15',
    status: 'active',
    medications: ['Lisinopril 10mg', 'Hydrochlorothiazide 25mg'],
    notes: 'Contrôle régulier nécessaire'
  },
  {
    id: '2',
    patientId: '2',
    condition: 'Gastrite chronique',
    diagnosisDate: '2023-08-10',
    status: 'active',
    medications: ['Oméprazole 20mg'],
    notes: 'Éviter les aliments épicés et l\'alcool'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '3',
    appointmentDate: '2024-02-20',
    appointmentTime: '14:00',
    reason: 'Contrôle de grossesse - 18ème semaine',
    status: 'scheduled'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '3',
    appointmentDate: '2024-02-12',
    appointmentTime: '10:30',
    reason: 'Suivi gastrite',
    status: 'completed',
    notes: 'Amélioration constatée'
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '5',
    appointmentDate: '2024-02-18',
    appointmentTime: '09:15',
    reason: 'Contrôle tension artérielle',
    status: 'scheduled'
  },
  {
    id: '4',
    patientId: '4',
    doctorId: '3',
    appointmentDate: '2024-02-25',
    appointmentTime: '15:30',
    reason: 'Contrôle pédiatrique',
    status: 'scheduled'
  },
  {
    id: '5',
    patientId: '5',
    doctorId: '5',
    appointmentDate: '2024-02-22',
    appointmentTime: '11:00',
    reason: 'Consultation gynécologique de suivi',
    status: 'scheduled'
  },
  {
    id: '6',
    patientId: '1',
    doctorId: '3',
    appointmentDate: '2024-02-10',
    appointmentTime: '16:00',
    reason: 'Échographie morphologique',
    status: 'completed',
    notes: 'Échographie normale, développement conforme'
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Rapport Mensuel - Janvier 2024',
    type: 'monthly',
    dateRange: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    data: {
      newPatients: 15,
      totalConsultations: 87,
      totalAppointments: 95,
      completedAppointments: 82,
      cancelledAppointments: 8,
      minorPatients: 12,
      majorPatients: 75,
      commonDiagnoses: [
        { diagnosis: 'Grippe', count: 23 },
        { diagnosis: 'Hypertension', count: 15 },
        { diagnosis: 'Diabète Type 2', count: 12 },
        { diagnosis: 'Gastrite', count: 8 },
        { diagnosis: 'Contrôle grossesse', count: 6 }
      ],
      genderDistribution: {
        male: 42,
        female: 45
      }
    },
    generatedAt: '2024-02-01T09:00:00Z',
    generatedBy: '3'
  },
  {
    id: '2',
    title: 'Rapport Hebdomadaire - Semaine 6',
    type: 'custom',
    dateRange: {
      start: '2024-02-05',
      end: '2024-02-11'
    },
    data: {
      newPatients: 3,
      totalConsultations: 18,
      totalAppointments: 22,
      completedAppointments: 16,
      cancelledAppointments: 2,
      minorPatients: 2,
      majorPatients: 16,
      commonDiagnoses: [
        { diagnosis: 'Contrôle routine', count: 8 },
        { diagnosis: 'Hypertension', count: 4 },
        { diagnosis: 'Vaccination', count: 3 },
        { diagnosis: 'Gastrite', count: 2 },
        { diagnosis: 'Consultation gynécologique', count: 1 }
      ],
      genderDistribution: {
        male: 8,
        female: 10
      }
    },
    generatedAt: '2024-02-12T08:30:00Z',
    generatedBy: '3'
  }
];