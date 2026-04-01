'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Game1 from '../../components/Game1';

export default function HomePage() {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
      router.replace('/auth/not-authorized');
      return;
    }

    setIsAllowed(true);
  }, [router]);

  if (!isAllowed) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-10">
      <h1 className="text-4xl font-bold mb-4 text-white text-center">
        Selamat Datang!
      </h1>
      <Game1 />
    </div>
  );
}