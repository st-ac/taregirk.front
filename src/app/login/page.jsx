'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';
import Link from "next/link";

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const data = await login(form);
            localStorage.setItem('token', data.token);
            setSuccess("Connexion réussie ! Redirection...");
            setTimeout(() => router.push('/'), 1000);
        } catch (err) {
            setError(err.message || "Erreur de connexion");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-lg">
                <Link href="/" className="inline-block mb-6 text-sm font-bold text-black hover:text-gray-700">
                    ← Retour sur le site
                </Link>

                <h1 className="text-2xl text-black font-bold mb-6">Portail de connexion</h1>

                <form onSubmit={handleSubmit} className="space-y-4 text-black ">
                    <input
                        name="username"
                        placeholder="Nom d'utilisateur"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-400 rounded-md "
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-400 rounded-md "
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Se connecter
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-700">
                    Pas encore de compte ?{' '}
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Inscrivez vous
                    </Link>
                </p>

                {error && <p className="text-red-500 mt-4">{error}</p>}
                {success && <p className="text-green-500 mt-4">{success}</p>}
            </div>
        </div>
    );
}