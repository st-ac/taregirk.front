'use client';
import { useState, useEffect } from "react";
import ArchiveTable from "@/app/components/ArchiveTable";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Récupération du user connecté (pour id + username)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Non connecté");
        const res = await fetch('http://127.0.0.1:8000/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Erreur fetch');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handlePasswordUpdate = async (e) => {
  e.preventDefault();
  setStatusMsg('');
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => null);
      throw new Error(d?.error || 'Erreur lors de la réinitialisation');
    }
    setStatusMsg('✅ Mot de passe mis à jour avec succès !');
    setOldPassword(''); setNewPassword(''); setShowPasswordForm(false);
  } catch (e) {
    setStatusMsg('❌ ' + e.message);
  }};

  const handleDeleteAccount = async () => {
  if (!user?.id) return;
  if (!window.confirm("Supprimer votre compte ? Action irréversible.")) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://127.0.0.1:8000/api/users/${user.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Suppression échouée");
  } catch (e) {
    return alert("Erreur : " + e.message);
  }
  ["token", "username", "role", "user"].forEach(k => localStorage.removeItem(k));

  alert("Votre compte a été supprimé avec succès.");
  setTimeout(() => router.push('/'), 1000);
};

  if (loading) return <p className="text-center py-10">Chargement...</p>;
  if (!user) return <p className="text-center py-10">Vous devez être connecté.</p>;

  return (
  <div className="min-h-screen bg-gray-50 text-black px-6 py-12">
    {/* En-tête compte */}
    <div className="mb-10 text-center">
      <h1 className="text-3xl font-extrabold mb-2">
        Mon compte : <span className="text-amber-900">{user.username}</span>
      </h1>
      <p className="text-gray-600">Gérez vos archives et vos paramètres</p>
    </div>

    {/* Table des archives */}
    <div className="mb-12">
      <ArchiveTable
        fetchUrl="http://127.0.0.1:8000/api/users/me"
        title={`Archives de ${user.username}`}
      />
    </div>

    {/* Section mot de passe */}
    <div className="max-w-md mx-auto mb-12">
      <button
        className="w-full px-4 py-2 bg-amber-900 text-white rounded-lg shadow hover:bg-amber-950 transition"
        onClick={() => setShowPasswordForm(!showPasswordForm)}
      >
        {showPasswordForm ? "Annuler" : "Réinitialiser le mot de passe"}
      </button>

      {showPasswordForm && (
        <form
          onSubmit={handlePasswordUpdate}
          className="mt-6 bg-white border rounded-lg p-6 space-y-4 shadow"
        >
          <div>
            <label className="block mb-1 font-medium">Ancien mot de passe</label>
            <input
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="w-full border rounded p-2 focus:ring focus:ring-amber-200"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full border rounded p-2 focus:ring focus:ring-amber-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Valider
          </button>
        </form>
      )}

      {statusMsg && (
        <p className="text-center mt-4 font-medium text-sm">{statusMsg}</p>
      )}
    </div>

    {/* Suppression de compte */}
    <div className="max-w-md mx-auto text-center mt-10">
      <button
        onClick={handleDeleteAccount}
        className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        Supprimer mon compte
      </button>
    </div>
  </div>
);
}