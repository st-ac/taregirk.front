'use client';

import ArchiveList from "../components/ArchiveList";



export default function ArchivesPage() {
    return (
        <div className="p-6">
            <h1 className="text-4xl font-extrabold mb-8 text-center">Toutes les Archives </h1>
            <ArchiveList filter={{}} />
        </div>
    );
}