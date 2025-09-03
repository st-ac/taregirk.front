'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";


export default function ArchiveScreen() {
    const { id } = useParams();
    const [archive, setArchive] = useState(null);

    useEffect(() => {
        const fetchArchive = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/archives/${id}`)
            const data = await res.json();
            setArchive(data);
        } catch (err) {
            console.error("erreur fetch", err);
        }
    };
    if (id) fetchArchive();
}, [id]);

if (!archive) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 animate-pulse">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Retour */}
      <Link href="/archives">
        <button className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm transition">
          ← Retour aux archives
        </button>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Titre */}
        <h1 className="text-3xl font-bold text-gray-800">{archive.title}</h1>

        {/* Meta infos */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <p><span className="font-semibold">Auteur :</span> {archive.author || "Inconnu"}</p>
          <p><span className="font-semibold">Statut :</span> 
            <span className={`ml-1 px-2 py-1 rounded text-xs ${
              archive.status === "accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {archive.status}
            </span>
          </p>
          <p><span className="font-semibold">Créé le :</span> {archive.createdAt || "N/A"}</p>
        </div>

        {/* Description en avant */}
        <div className="prose max-w-none text-gray-800 leading-relaxed bg-gray-50 p-6 rounded-xl border">
          {archive.description || "Aucune description disponible."}
        </div>

        {/* Galerie d’images optionnelle */}
        {archive?.images && archive.images.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Illustrations</h2>
            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {archive.images.map((img, index) => (
                <div
                  key={index}
                  className="min-w-[200px] h-40 rounded-xl overflow-hidden shadow hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => window.open(img, "_blank")}
                >
                  <img
                    src={img}
                    alt={`${archive.title} - illustration ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Cliquez sur une image pour l’agrandir
            </p>
          </div>
        )}
      </div>
    </div>
  );
}