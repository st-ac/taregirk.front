import { useState, useEffect } from "react";
import Link from 'next/link';


export default function ArchiveList({ filter = {} }) {
  const [archives, setArchives] = useState([]);

  const buildUrl = () => {
    const url = new URL("http://127.0.0.1:8000/api/archives");
    if (filter.userId) url.searchParams.append("userId", filter.userId);
    if (filter.category) url.searchParams.append("category", filter.category);
    return url.toString();
  };

  const fetchArchives = () => {
    fetch(buildUrl())
      .then(res => res.json())
      .then(data => setArchives(data));
  };

  useEffect(() => {
    fetchArchives();
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto p-6 ">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {archives.length === 0 && <p className="col-span-full text-center text-gray-500">Aucune archive trouvée.</p>}

        {archives.map(a => (
          <Link key={a.id} href={`/archives/${a.id}`} className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
            {a.images?.length > 0 ? (
              <img
                src={a.images[0]}
                alt={a.title}
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
    </div>
  );
}