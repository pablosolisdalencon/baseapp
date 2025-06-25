"use client"
import Navbar from "@/components/Navbar";
import "./globals.css"
import { SessionProvider } from "next-auth/react";
// Eliminada la directiva "use client" para convertirlo en un Server Component
import "./globals.css"; // Asegurarse que los globales están importados

// Metadata ahora funcionará como se espera en un Server Component


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
