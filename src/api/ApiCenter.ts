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

const api = axios.create({
    baseURL: 'http://localhost:3000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = async (userData: RegisterUserData): Promise<RegisterUserResponse> => {

    const filtredData: FilteredRegisterData = {
        nom: userData.firstName + ' ' + userData.lastName,
        email: userData.email,
        password: userData.password
    };

    const response = await api.post<RegisterUserResponse>('/auth/register', filtredData);
    return response.data;
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
};
