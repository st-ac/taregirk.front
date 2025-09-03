'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateArchive() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/category")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error("Réponse inattendue:", data);
                    setErrorCategories("Impossible de charger les catégories");
                }
            })
            .catch(err => {
                console.error("Erreur chargement catégories:", err);
                setErrorCategories("Erreur réseau lors du chargement des catégories");
            })
            .finally(() => setLoadingCategories(false));
    }, []);

    const handleFileChange = (e) => setImages([...images, ...Array.from(e.target.files)]);
    const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx));

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification des champs obligatoires
        if (!title || !description || !author || !categoryId) {
            alert("Veuillez remplir tous les champs et choisir une catégorie.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("author", author);
        formData.append("category_id", categoryId);
        images.forEach(img => formData.append("images[]", img));
        try {
            const res = await fetch("http://127.0.0.1:8000/api/archives/create", {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                alert(errData.error || "Erreur lors de la création de l'archive");
                return;
            }

            setTitle('');
            setDescription('');
            setAuthor('');
            setCategoryId('');
            setImages([]);

            router.push('/archives');
        } catch (err) {
            console.error("Erreur soumission archive:", err);
            alert("Erreur réseau, veuillez réessayer.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center py-12 px-4">
            <h1 className="text-4xl font-bold text-red-950 mb-8">Créer une Archive</h1>

            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            placeholder="Titre"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="flex-1 p-4 border border-gray-300 rounded-lg"
                            required
                        />
                        <input
                            placeholder="Auteur"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            className="flex-1 p-4 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg"
                        rows={4}
                        required
                    />

                    <div className="space-y-2">
                        <label className="block font-semibold">Catégorie</label>
                        {loadingCategories ? (
                            <p>Chargement des catégories...</p>
                        ) : errorCategories ? (
                            <p className="text-red-500">{errorCategories}</p>
                        ) : (
                            <select
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                required
                            >
                                <option value="">-- Choisir une catégorie --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block font-semibold">Images</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />

                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-3">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt="preview"
                                            className="w-full h-28 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-amber-900 text-white font-semibold rounded-lg hover:bg-amber-950 transition-colors"
                    >
                        Créer l'archive
                    </button>

                </form>

                <p className="text-green-600 text-sm mt-2">
                    Après soumission, votre archive sera en attente de validation.
                </p>
            </div>
        </div>
    );
}