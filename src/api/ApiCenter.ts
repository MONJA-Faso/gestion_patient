import axios from "axios";
import { User, RegisterUserData, RegisterUserResponse } from "../types";

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

// filtre les données à envoyer au backend
interface FilteredRegisterData {
    nom: string;
    email: string;
    password: string;
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
    const filtredData: FilteredRegisterData = {
        nom: userData.firstName + ' ' + userData.lastName,
        email: userData.email,
        password: userData.password,
    };

    const response = await api.post<RegisterUserResponse>('/auth/register', filtredData);
    return response.data;
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    console.log(response.data.user);    
    return response.data;
};

