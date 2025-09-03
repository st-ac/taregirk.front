'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CategoriesListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/category');
        if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Chargement...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="relative mb-12 text-center">
      <div className="inline-block px-6 py-2 border-2 border-amber-900 rounded-full bg-amber-100 shadow-md">
            <h1 className="text-4xl font-extrabold text-amber-900">
              Catégories
            </h1>
          </div>
          </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.id}`} className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Pas d'image</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h2 className="text-xl font-semibold text-white">{cat.title}</h2>
              <p className="text-gray-200 text-sm mt-1 line-clamp-2">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}