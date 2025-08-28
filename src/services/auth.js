'use client';

import { jwtDecode } from "jwt-decode";

export async function register(userData) {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Erreur lors de l\'inscription');
        }

        return await res.json();
    } catch (err) {
        throw err; // On renvoie l'erreur au composant qui utilisera register()
    }
}

export async function login(userData) {
    try {
        const res = await fetch('http://localhost:8000/api/login_check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Erreur de connexion');
        }
        const data = await res.json();
        localStorage.setItem("token", data.token); 
        
        const decoded = jwtDecode(data.token);
        localStorage.setItem("role", decoded.roles[0]);
        localStorage.setItem("username", decoded.username);
        
        return data;
    } catch (err) {
        throw err;
    }
}

export function getToken() {
    return localStorage.getItem("token");
}

// Déconnexion simple
export function logout() {
    localStorage.removeItem("token");
}