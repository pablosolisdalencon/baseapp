'use client';
import Link from "next/link";
import { useSession, signIn, signOut } from 'next-auth/react';

function FooterClient() {
  const { data: session } = useSession();
  
  return (
    <div className="p-4 bg-blue-950 text-amber-50 rounded-lg shadow-sm border border-gray-200 mb-4 align-middle">
        <h1>Subete a la Ola!</h1>
        <h2>eWave</h2>
    </div>
  );
}

export default FooterClient;