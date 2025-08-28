'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCategoryPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: null, // fichier image
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // 🔒 Vérification du rôle
  useEffect(() => {
  const role = localStorage.getItem('role');
  console.log("Role trouvé:", role);
  if (role !== 'ROLE_ADMIN') {
    router.push('/');
  }
}, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/category/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (res.status === 403) {
        throw new Error('Accès refusé : droits administrateur requis ❌');
      }
      if (res.status === 401) {
        throw new Error('Veuillez vous connecter 🔑');
      }
      if (!res.ok) {
        throw new Error("Erreur lors de la création de la catégorie");
      }

      const data = await res.json();
      console.log('Catégorie créée :', data);
      setSuccess('Catégorie créée avec succès ✅');
      setForm({ title: '', description: '', image: null });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="h-full max-w-md text-black flex flex-col bg-white p-8 m-5 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Créer une Catégorie</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border border-black p-2 rounded-md"
            name="title"
            placeholder="Titre de la catégorie"
            onChange={handleChange}
            value={form.title}
            required
          />

          <input
            className="w-full border border-black p-2 rounded-md"
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={form.description}
            required
          />

          <input
            type="file"
            accept="image/*"
            className="w-full border border-black p-2 rounded-md"
            name="image"
            onChange={handleFileChange}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
          >
            Créer
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
}