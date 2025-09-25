import axios from "axios";
import { User, RegisterUserData, RegisterUserResponse, LoginResponse } from "../types";

// parse les données à envoyer au backend
interface ParsedRegisterUserData {
    nom: string;
    prenom: string;
    email: string;
    mot_de_passe: string;
    role: 'Secretaire' | 'Infirmiere' | 'Medecin_Chef';
}

interface ParsedLoginUserData {
    email: string;
    mot_de_passe: string;
}

export const api = axios.create({
    baseURL: 'http://localhost:3000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fonction pour brancher les interceptors
export const setupInterceptors = (logout: () => void) => {

    // Ajout du token automatiquement
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('medcare_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Gestion des erreurs 401
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                console.warn("Token expiré ou invalide, déconnexion forcée.");
                logout();
            }
            return Promise.reject(error);
        }
    );
};

export const registerUser = async (userData: RegisterUserData): Promise<RegisterUserResponse> => {

    const parsedData: ParsedRegisterUserData = {
        nom: userData.lastName,
        prenom: userData.firstName,
        email: userData.email,
        mot_de_passe: userData.password,
        role: userData.role,
    };

    const response = await api.post<RegisterUserResponse>('/auth/register', parsedData);
    return response.data;
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const parsedData: ParsedLoginUserData = {
        email: email,
        mot_de_passe: password,
    };
    const response = await api.post<LoginResponse>('/auth/login', parsedData);
    console.log("Reponse Login :", response.data);
    return response.data;
};

export const getMe = async (id: number, token: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    try {
        const response = await api.patch<{ message: string }>(
            `/auth/${userId}/changePassword`,
            {
                oldPassword: currentPassword,
                newPassword: newPassword,
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw error;
        } else {
            throw new Error('Erreur de connexion');
        }
    }
};

export const createUser = async (userData: RegisterUserData): Promise<RegisterUserResponse> => {

    const token = localStorage.getItem('medcare_token');

    const parsedData: ParsedRegisterUserData = {
        nom: userData.lastName,
        prenom: userData.firstName,
        email: userData.email,
        mot_de_passe: userData.password,
        role: userData.role,
    };

    const response = await api.post<RegisterUserResponse>('/users/create', parsedData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data
}

export const getAllUsers = async (): Promise<User[]> => {
    const token = localStorage.getItem('medcare_token');
    const response = await api.get<User[]>('/users/allUsers', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const updateUserDetails = async (id: string, updates: Partial<User>): Promise<User> => {
    const token = localStorage.getItem('medcare_token');

    const parsedData: Partial<User> = {
        nom: updates.nom || '',
        prenom: updates.prenom || '',
        email: updates.email || '',
        role: updates.role as 'Secretaire' | 'Infirmiere' | 'Medecin_Chef'
    };

    const response = await api.put<User>(`/users/${id}`, parsedData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}