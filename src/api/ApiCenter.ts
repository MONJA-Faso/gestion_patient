import axios from "axios";
import {
    User,
    RegisterUserData,
    RegisterUserResponse,
    LoginResponse,
    Patient,
    Appointment,
} from "../types";

// Types
type UserRole = 'Secretaire' | 'Infirmiere' | 'Medecin_Chef';

interface ParsedRegisterUserData {
    nom: string;
    prenom: string;
    email: string;
    mot_de_passe: string;
    role: UserRole;
}

interface ParsedLoginUserData {
    email: string;
    mot_de_passe: string;
}

// Axios instance
export const api = axios.create({
    baseURL: 'http://localhost:3000/api/',
    headers: { 'Content-Type': 'application/json' },
});

// Helpers
const getToken = () => localStorage.getItem('medcare_token') || '';

const authHeader = () => ({
    Authorization: `Bearer ${getToken()}`
});

// Dashboard APIs
export const getDashboardInfo = async (): Promise<any[]> => {
    try {
        const { data } = await api.get('/dashboard', {
            headers: authHeader() 
        });
        return data;
    } catch (error: any) {
        throw error.response ? error : new Error('Erreur de connexion');
    }
}

// User APIs
export const registerUser = async (userData: RegisterUserData): Promise<RegisterUserResponse> => {
    const parsedData: ParsedRegisterUserData = {
        nom: userData.lastName,
        prenom: userData.firstName,
        email: userData.email,
        mot_de_passe: userData.password,
        role: userData.role,
    };
    const { data } = await api.post<RegisterUserResponse>('/auth/register', parsedData);
    return data;
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const parsedData: ParsedLoginUserData = { email, mot_de_passe: password };
    const { data } = await api.post<LoginResponse>('/auth/login', parsedData);
    return data;
};

export const getMe = async (id: number, token: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

export const changePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string
): Promise<{ message: string }> => {
    try {
        const { data } = await api.patch<{ message: string }>(
            `/auth/${userId}/changePassword`,
            { oldPassword: currentPassword, newPassword }
        );
        return data;
    } catch (error: any) {
        throw error.response ? error : new Error('Erreur de connexion');
    }
};

export const createUser = async (userData: RegisterUserData): Promise<RegisterUserResponse> => {
    const parsedData: ParsedRegisterUserData = {
        nom: userData.lastName,
        prenom: userData.firstName,
        email: userData.email,
        mot_de_passe: userData.password,
        role: userData.role,
    };
    const { data } = await api.post<RegisterUserResponse>('/users/create', parsedData, {
        headers: authHeader()
    });
    return data;
};

export const getAllUsers = async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users/allUsers', {
        headers: authHeader()
    });
    return data;
};

export const updateUserDetails = async (id: string, updates: Partial<User>): Promise<User> => {
    const parsedData: Partial<User> = {
        nom: updates.nom ?? '',
        prenom: updates.prenom ?? '',
        email: updates.email ?? '',
        role: updates.role as UserRole,
    };
    const { data } = await api.put<User>(`/users/${id}`, parsedData, {
        headers: authHeader()
    });
    return data;
};

export const deleteSingleUser = async (id: string): Promise<string> => {
    const { data } = await api.delete(`/users/${id}`, {
        headers: authHeader()
    });
    return data;
};

export const toggleSingleUserStatus = async (id: string, userStatus: boolean): Promise<string> => {
    const { data } = await api.patch(`/users/${id}/toggleStatus`, { isActive: userStatus }, {
        headers: authHeader()
    });
    return data;
};

// Patient APIs
export const createPatient = async (
    patientData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>
): Promise<any> => {
    const formattedPatientData = {
        prenom: patientData.prenom,
        nom: patientData.nom,
        sexe: patientData.sexe,
        dateNaissance: patientData.dateNaissance,
        adresse: patientData.adresse,
    };
    const { data } = await api.post<any>('/patients/create', formattedPatientData, {
        headers: authHeader()
    });
    return data;
};

export const updateSignlePatient = async (id: string, updates: Partial<Patient>): Promise<Patient> => {
    const { data } = await api.put<Patient>(`/patients/${id}`, updates, {
        headers: authHeader()
    });
    return data;
}

export const getAllPatients = async (): Promise<any[]> => {
    const { data } = await api.get<any[]>('/patients/', {
        headers: authHeader()
    });
    return data;
};

export const getPatientDetails = async (id: string): Promise<Patient> => {
    const { data } = await api.get<Patient>(`/patients/${id}`, {
        headers: authHeader()
    });
    return data;
};

export const deleteSinglePatient = async (id: string): Promise<string> => {
    const { data } = await api.delete(`/patients/${id}`, {
        headers: authHeader()
    });
    return data;
};

// rendez-vous APIs

export const fetchAllApointement = async (): Promise<Appointment[]> => {
    const { data } = await api.get(`/rendezvous`, {
        headers: authHeader()
    });
    return data;
}