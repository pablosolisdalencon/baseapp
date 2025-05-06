import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Navbar';
import {Providers} from "./Providers";




export const metadata: Metadata = {
  title: "eWave [ Epic Media Wave ]",
  description: "Marketing Projects Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
        <Navbar/>
        {children}
        </Providers>
      </body>
    </html>
  );
}
