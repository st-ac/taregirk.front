'use client'

import ArchiveList from "@/app/components/ArchiveList";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

export default function CategoryId() {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
  fetch(`http://127.0.0.1:8000/api/category/${id}`)
      .then(res => res.json())
    .then(data => setCategory(data))
}, [id]);

  return (
  <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-black px-6 py-12">
    {category ? (
      <>
        {/* Header décoratif */}
        <div className="relative mb-12 text-center">
          <div className="inline-block px-6 py-2 border-2 border-amber-900 rounded-full bg-amber-100 shadow-md">
            <h1 className="text-4xl font-extrabold text-amber-900">
              Archives de {category.title}
            </h1>
          </div>
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-amber-900 rounded"></div>
        </div>

        {/* Description encadrée */}
        <div className="max-w-3xl mx-auto mb-10 p-6 bg-amber-50 border-l-4 border-amber-900 rounded shadow-sm">
          <p className="text-lg text-gray-800 text-center">{category.description}</p>
        </div>

        {/* ArchiveList avec marge */}
        <div className="max-w-6xl mx-auto">
          <ArchiveList filter={{ category: id }} />
        </div>

        {/* Bouton retour */}
        <div className="text-center mt-12">
          <a
            href="/archives"
            className="inline-block px-8 py-3 bg-amber-900 text-white font-semibold rounded-lg hover:bg-amber-950 shadow-lg transition-colors"
          >
            Voir toutes les archives
          </a>
        </div>
      </>
    ) : (
      <p className="text-center py-20 text-gray-500 text-xl">Chargement...</p>
    )}
  </div>
);
}