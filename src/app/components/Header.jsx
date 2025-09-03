'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [search, setSearch] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    setIsLogged(false);
  };

  return (
    <>
      {/* --- Header --- */}
      <header className="bg-[#3c1f1f] text-white flex md:flex-row items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={150} height={120} />
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex items-center w-1/2">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1 bg-white rounded-l-md text-black"
          />
          <button type="submit" className="bg-white px-3 py-1 rounded-r-md">🔍</button>
        </form>


        <div>
          {isLogged ? (
            <button
              onClick={handleLogout}
              className="bg-white text-black font-bold px-4 py-1 rounded-md hover:bg-gray-200"
            >
              Déconnexion
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-white text-black font-bold px-4 py-1 rounded-md hover:bg-gray-200">
                Connexion
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* --- Navigation boutons --- */}
      <nav className="bg-[#5a2a2a] flex justify-around text-white py-2">
        <Link href="/categories" className="hover:underline">
          Catégories
        </Link>
        <Link href="/archives/create" className="hover:underline">
          Créer une Archive
        </Link>
        <Link href="/archives" className="hover:underline">
          Toutes les archives
        </Link>
        <Link href="/account" className="hover:underline">
          Compte
        </Link>
      </nav>
    </>
  );
}