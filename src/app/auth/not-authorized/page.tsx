'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotAuthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Anda belum login</h1>
        <p className="text-gray-600 mb-6">
          Halaman game hanya bisa diakses oleh pengguna yang sudah login.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Kamu akan diarahkan ke halaman login dalam 3 detik...
        </p>

        <Link
          href="/auth/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg"
        >
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
}