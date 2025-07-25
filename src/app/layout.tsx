import Navbar from "@/components/Navbar";
import "./globals.css"
import { Providers } from "./Providers";
import FooterClient from "@/components/FooterClient";
// Metadata ahora funcionará como se espera en un Server Component


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Navbar />
          {children}
          <FooterClient />
        </Providers>
      </body>
    </html>
  );
}
