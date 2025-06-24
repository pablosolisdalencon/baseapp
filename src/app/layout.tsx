"use client"
import Navbar from "@/components/Navbar";
import "./globals.css"
import { SessionProvider } from "next-auth/react";
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
