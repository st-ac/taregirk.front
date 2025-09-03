'use client';
import { useEffect, useState } from 'react';

export default function ArchiveTable({ fetchUrl, title = 'Archives', admin = false }) {
  const [archives, setArchives] = useState(null);     // null = loading
  const [selected, setSelected] = useState(null);     // objet archive ou null

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(fetchUrl, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error('fetch error');
        const data = await res.json();
        setArchives(Array.isArray(data) ? data : Array.isArray(data?.archives) ? data.archives : []);
      } catch {
        setArchives([]);
      }
    })();
  }, [fetchUrl]);

  const review = async (id, status) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/archives/admin/${id}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('review error');
      setArchives((list) => list.filter((x) => x.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      alert('Action impossible');
    }
  };

  if (archives === null) return <p className="text-center py-10">Chargement...</p>;
  if (archives.length === 0) return <p className="italic text-gray-600">Aucune archive trouvée.</p>;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="w-full border-collapse text-left">
          <thead className="bg-amber-900 text-white">
            <tr>
              <th className="p-3">Titre</th>
              <th className="p-3">Date</th>
              <th className="p-3">Statut</th>
              {admin && <th className="p-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {archives.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(a)}>
                <td className="p-3">{a.title}</td>
                <td className="p-3">{a.createdAt}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      a.status === 'accepted'
                        ? 'bg-green-200 text-green-800'
                        : a.status === 'pending'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                {admin && (
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => review(a.id, 'accept')}
                        className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() => review(a.id, 'reject')}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Rejeter
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-3xl bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="rounded p-2 hover:bg-gray-100" aria-label="Fermer">
                ✕
              </button>
            </div>

            <div className="text-sm text-gray-600 mb-4 space-y-1">
              <div><span className="font-medium">Auteur :</span> {selected.author || '—'}</div>
              <div><span className="font-medium">Créé le :</span> {selected.createdAt || '—'}</div>
              <div className="mt-3">
                <span className="font-medium">Description :</span>
                <p className="mt-1 text-gray-800 leading-relaxed">{selected.description || '—'}</p>
              </div>
            </div>

            {Array.isArray(selected.images) && selected.images.length > 0 && (
              <>
                <h4 className="font-semibold mb-2">Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selected.images.map((url, i) => (
                    <button
                      key={i}
                      className="relative h-28 rounded-lg overflow-hidden border hover:ring-2 hover:ring-amber-400"
                      onClick={() => window.open(url, '_blank')}
                      title="Ouvrir en grand"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {admin && (
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => review(selected.id, 'reject')}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Rejeter
                </button>
                <button
                  onClick={() => review(selected.id, 'accept')}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Accepter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}