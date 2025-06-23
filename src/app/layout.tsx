"use client"
import NavbarClient from "@/components/NavbarClient";
import { Providers } from "./Providers"; // Importar Providers
import "./globals.css"; // Asegurarse que los globales están importados

// Metadata (ejemplo, ajustar según necesidad)
export const metadata = {
  title: 'Mi Aplicación con Next.js',
  description: 'Una descripción de mi aplicación',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers> {/* Envolver todo con Providers */}
          <NavbarClient />
          <main>{children}</main> {/* Es buena práctica envolver children en un <main> */}
        </Providers>
      </body>
    </html>
  );
}
