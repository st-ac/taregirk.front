'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/services/auth';

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password !== form.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await register(form);
            setSuccess("Inscription réussie ! Redirection vers la page de connexion...");
            setForm({ username: '', email: '', password: '', confirmPassword: '' });
            setTimeout(() => router.push('/login'), 2000);
        } catch (err) {
            setError(err.message || "Erreur lors de l'inscription.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-lg">
                <h1 className="text-2xl text-black font-bold mb-6 text-center">Créer un compte</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="username"
                        placeholder="Nom d'utilisateur"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full text-black p-2 border border-gray-400 rounded-md "
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Adresse Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full text-black p-2 border border-gray-400 rounded-md "
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full text-black p-2 border border-gray-400 rounded-md "
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmer mot de passe"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full text-black p-2 border border-gray-400 rounded-md "
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        S'inscrire
                    </button>
                </form>

                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                {success && <p className="text-green-500 mt-4 text-center">{success}</p>}

                <p className="mt-6 text-center text-sm text-gray-700">
                    Déjà un compte ?{' '}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Connectez-vous
                    </Link>
                </p>
            </div>
        </div>
    );
}