import Navbar from "@/components/Navbar";
import { AppProvider } from "@/app/AppContext";
import { SessionProvider } from "next-auth/react";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
