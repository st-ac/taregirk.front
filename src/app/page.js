'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-white text-black">

      {/* --- Section Citation (vide pour l’instant) --- */}
      <section className="relative w-full h-80 bg-cover bg-center" style={{ backgroundImage: "url('/bataille.jpg')" }}>
        <div className="absolute bottom-4 w-full text-center text-yellow-300 font-bold">
          {/* Citation vide pour l'instant */}
          <div className="text-lg">« ... »</div>
          <div className="text-sm">Auteur — Date</div>
        </div>
      </section>

      {/* --- Section Archives (liste réduite) --- */}
      <section className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <Image src="/archive1.jpg" alt="Archive 1" width={300} height={200} className="mx-auto rounded-md" />
          <p className="text-sm mt-2">20/03/2025 - Mickael</p>
          <p className="text-base font-semibold">Tigran II</p>
        </div>

        <div className="text-center">
          <Image src="/archive2.jpg" alt="Archive 2" width={300} height={200} className="mx-auto rounded-md" />
          <p className="text-sm mt-2">21/03/2025 - David</p>
          <p className="text-base font-semibold">Hayq Nahapet</p>
        </div>

        <div className="text-center">
          <Image src="/archive3.jpg" alt="Archive 3" width={300} height={200} className="mx-auto rounded-md" />
          <p className="text-sm mt-2">25/03/2025 - James</p>
          <p className="text-base font-semibold">Monastère de Tatev</p>
        </div>
      </section>
    </div>
  );
}