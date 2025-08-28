'use client';
import { useEffect, useState } from 'react';

export default function ArchiveList() {
    const [archives, setArchives] = useState([]);
    useEffect(() => {
        const fetchArchives = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/archives');
                if (!res.ok) throw new Error("Erreur lors du chargement des archives");
                const data = await res.json();
                setArchives(data);
            } catch (err) {
                console.error("Erreur :", err.message);
            }
        };

        fetchArchives();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Archives</h1>
            {archives.length === 0 ? (
                <p>Aucune archive disponible.</p>
            ) : (
                <ul className="space-y-4">
                    {archives.map((archive) => (
                        <li key={archive.id} className="border p-4 rounded shadow">
                            <h2 className="text-lg font-semibold">{archive.title}</h2>
                            <p>{archive.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )};
 