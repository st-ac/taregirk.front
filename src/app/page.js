'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';

export default function HomePage() {
  const [archives, setArchives] = useState([]);
  const [citation, setCitation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchivesMainPage = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/archives');
        const data = await res.json();
        setArchives(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCitation = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/citations");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const random = data[Math.floor(Math.random() * data.length)];
          setCitation(random);
        }
      } catch (err) {
        console.error("Erreur citation :", err);
      }
    };

    fetchArchivesMainPage();
    fetchCitation();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Erreur : {error}</p>;
  if (archives.length === 0) return <p className="text-center mt-10 text-gray-500">Aucune archive trouvée.</p>;

  const [firstArchive, ...otherArchives] = archives.slice(0, 7);

  return (
    <div className="min-h-screen bg-white text-black px-4 py-12">
      <section
        className="relative w-full h-100 bg-cover bg-center mb-12"
        style={{
    backgroundImage: citation
      ? `url(http://127.0.0.1:8000/uploads/images/${citation.image})`
      : "none",
  }}
        >
        <div className="absolute bottom-4 w-full text-center text-yellow-300 font-bold">
          {citation ? (
            <>
              <div className="text-lg">« {citation.description} »</div>
              <div className="text-sm">
                {citation.author || "Auteur inconnu"} —{" "}
                {citation.archive?.title ? citation.archive.title : "Archive non liée"}
              </div>
            </>
          ) : (
            <>
              <div className="text-lg">« ... »</div>
              <div className="text-sm">Auteur — Archive</div>
            </>
          )}
        </div>
      </section>

      <h1 className="text-4xl font-extrabold mb-12 text-center">Archives récentes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {firstArchive && (
          <Link
            href={`/archives/${firstArchive.id}`}
            className="lg:col-span-3 group relative block rounded-xl overflow-hidden shadow-2xl hover:shadow-4xl transition-all duration-500 bg-white"
          >
            {firstArchive.image ? (
              <img
                src={`http://127.0.0.1:8000${firstArchive.image}`}
                alt={`Image de l'archive ${firstArchive.title}`}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Pas d'image</span>
              </div>
            )}

            <div className="p-6">
              <h2 className="text-3xl font-bold mb-2">{firstArchive.title}</h2>
              <p className="text-gray-500 text-sm mb-1">Catégorie: {firstArchive.category}</p>
              <p className="text-gray-500 text-sm mb-1">Auteur: {firstArchive.author}</p>
              <p className="text-gray-500 text-sm">Créé le: {firstArchive.createdAt}</p>
            </div>
          </Link>
        )}
        
        {otherArchives.map(a => (
          <Link
            key={a.id}
            href={`/archives/${a.id}`}
            className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white"
          >
            {a.image ? (
              <img
                src={`http://127.0.0.1:8000${a.image}`}
                alt={`Image de l'archive ${a.title}`}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Pas d'image</span>
              </div>
            )}

            <div className="p-4">
              <h2 className="text-xl font-semibold">{a.title}</h2>
              <p className="text-gray-500 text-sm mt-1">Catégorie: {a.category}</p>
              <p className="text-gray-500 text-sm mt-1">Auteur: {a.author}</p>
              <p className="text-gray-500 text-sm mt-1">Créé le: {a.createdAt}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/archives"
          className="inline-block px-6 py-3 bg-amber-900 text-white font-semibold rounded-lg hover:bg-amber-950 transition-colors"
        >
          Voir toutes les archives
        </Link>
      </div>
    </div>
  );
}