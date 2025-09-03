'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const params = useSearchParams();
  const q = params.get('q') || '';
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/archives?status=accepted&search=${encodeURIComponent(q)}`);
        const data = await res.json();
        setArchives(Array.isArray(data) ? data : []);
      } catch {
        setArchives([]);
      } finally {
        setLoading(false);
      }
    };
    if (q) load();
  }, [q]);

  if (!q) return <p className="text-center py-10">Tape une recherche…</p>;
  if (loading) return <p className="text-center py-10">Chargement…</p>;
  if (archives.length === 0) return <p className="text-center py-10">Aucun résultat pour “{q}”.</p>;

  return (
    <div className="min-h-screen bg-white text-black px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Résultats pour “{q}”</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {archives.map((a) => (
          <Link key={a.id} href={`/archives/${a.id}`} className="block rounded-lg overflow-hidden shadow bg-white hover:shadow-lg transition">
            {a.image ? (
              <img src={`http://127.0.0.1:8000${a.image}`} alt={a.title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">Pas d'image</div>
            )}
            <div className="p-4">
              <div className="font-semibold">{a.title}</div>
              <div className="text-sm text-gray-500 mt-1">{a.author}</div>
              <div className="text-xs text-gray-400 mt-1">{a.createdAt}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}