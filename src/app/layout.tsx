// Eliminada la directiva "use client" para convertirlo en un Server Component
import NavbarClient from "@/components/NavbarClient";
import { Providers } from "./Providers"; // Importar Providers
import "./globals.css"; // Asegurarse que los globales están importados

// Metadata ahora funcionará como se espera en un Server Component
export const metadata = {
  title: 'Mi Aplicación con Next.js',
  description: 'Una descripción de mi aplicación',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers> {/* Providers sigue siendo 'use client' internamente */}
          <NavbarClient /> {/* NavbarClient es 'use client' */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
