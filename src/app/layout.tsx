<<<<<<< HEAD
"use client"
import Navbar from "@/components/Navbar";
import "./globals.css"
import { SessionProvider } from "next-auth/react";
=======
// Eliminada la directiva "use client" para convertirlo en un Server Component
import NavbarClient from "@/components/NavbarClient";
import { Providers } from "./Providers"; // Importar Providers
import "./globals.css"; // Asegurarse que los globales están importados

// Metadata ahora funcionará como se espera en un Server Component
export const metadata = {
  title: 'Mi Aplicación con Next.js',
  description: 'Una descripción de mi aplicación',
}

>>>>>>> f257cb1c42ba8354c9a78354d4a2a253e59decf3
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
<<<<<<< HEAD
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
=======
        <Providers> {/* Providers sigue siendo 'use client' internamente */}
          <NavbarClient /> {/* NavbarClient es 'use client' */}
          <main>{children}</main>
        </Providers>
>>>>>>> f257cb1c42ba8354c9a78354d4a2a253e59decf3
      </body>
    </html>
  );
}
