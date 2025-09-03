'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminCitationsManage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [role, setRole] = useState(null);
  const [citations, setCitations] = useState([]);
  const [archives, setArchives] = useState([]);
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [archiveId, setArchiveId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();

  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMsg('');
      try {
        const cRes = await fetch('http://127.0.0.1:8000/api/citations');
        const cData = await cRes.json();
        setCitations(Array.isArray(cData) ? cData : []);

        const aRes = await fetch('http://127.0.0.1:8000/api/archives?status=accepted');
        const aData = await aRes.json();
        setArchives(Array.isArray(aData) ? aData.slice(0, 100) : []);
      } catch {
        setMsg('Erreur de chargement.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
  const r = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  setRole(r);
  if (r && r !== 'ROLE_ADMIN') router.push('/');
}, [router]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!description.trim() || !author.trim() || !archiveId || !imageFile) {
      setMsg('Tous les champs sont obligatoires.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('description', description.trim());
      fd.append('author', author.trim());
      fd.append('archive_id', archiveId);
      fd.append('image', imageFile);

      const res = await fetch('http://127.0.0.1:8000/api/citations/create', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Création impossible');

      setDescription('');
      setAuthor('');
      setArchiveId('');
      setImageFile(null);
      setMsg('✅ Citation créée.');

      // reload simple
      const cRes = await fetch('http://127.0.0.1:8000/api/citations');
      setCitations(await cRes.json());
    } catch (e) {
      setMsg('❌ ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette citation ?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:8000/api/citations/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Suppression impossible');
      setCitations(citations.filter((c) => c.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <p className="text-center py-10">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-black px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-8 text-center">Gérer les citations</h1>

      {/* Formulaire */}
      <form onSubmit={handleCreate} className="max-w-2xl mx-auto bg-white border rounded-lg p-6 shadow space-y-4 mb-12">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="« Texte de la citation »"
          className="w-full border rounded p-2"
          rows={3}
          required
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Auteur"
          className="w-full border rounded p-2"
          required
        />
        <select
          value={archiveId}
          onChange={(e) => setArchiveId(e.target.value)}
          className="w-full border rounded p-2"
          required
        >
          <option value="">— Choisir une archive —</option>
          {archives.map((a) => (
            <option key={a.id} value={a.id}>{a.title}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full border rounded p-2"
          required
        />
        <button type="submit" className="w-full px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-950">
          Enregistrer
        </button>
        {msg && <p className="text-center text-sm mt-2">{msg}</p>}
      </form>

      {/* Liste */}
      <div className="max-w-5xl mx-auto bg-white border rounded-lg p-6 shadow">
        {citations.length === 0 ? (
          <p className="text-center text-gray-600">Aucune citation.</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Texte</th>
                <th className="p-2">Auteur</th>
                <th className="p-2">Archive</th>
                <th className="p-2">Image</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {citations.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="p-2 max-w-[520px]"><span className="line-clamp-2">{c.description}</span></td>
                  <td className="p-2">{c.author}</td>
                  <td className="p-2">{c.archive?.title}</td>
                  <td className="p-2">
                    {c.image ? (
                      <img
                        src={`http://127.0.0.1:8000/uploads/images/${c.image}`}
    alt=""
    className="h-12 w-20 object-cover rounded border"
  />
                    ) : '—'}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 float-right"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}