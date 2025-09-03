'use client';
import { useState, useEffect } from 'react';
import ArchiveTable from '@/app/components/ArchiveTable';

export default function AdminArchivesPage() {
  const [status, setStatus] = useState('pending');
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Optionnel : bloquer la page si pas admin (selon ce que tu stockes en localStorage)
    const r = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    setRole(r);
  }, []);

  if (role && role !== 'ROLE_ADMIN') {
    return <p className="text-center py-10">Accès refusé (admin requis).</p>;
  }

  const fetchUrl = `http://127.0.0.1:8000/api/archives?status=${status}`;

  return (
    <div className="min-h-screen bg-gray-50 text-black px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Modération des archives</h1>
        <select
          className="border rounded px-3 py-2 bg-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">En attente</option>
          <option value="accepted">Acceptées</option>
          <option value="rejected">Rejetées</option>
        </select>
      </div>

      <ArchiveTable
        fetchUrl={fetchUrl}
        title={
          status === 'pending'
            ? 'Archives en attente'
            : status === 'accepted'
            ? 'Archives acceptées'
            : 'Archives rejetées'
        }
        admin={true}
      />
    </div>
  );
}