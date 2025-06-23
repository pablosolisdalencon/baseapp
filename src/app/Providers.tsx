'use client';
import { SessionProvider } from "next-auth/react";
import { AppProvider } from "./AppContext"; // Importar AppProvider

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AppProvider>
                {children}
            </AppProvider>
        </SessionProvider>
    );
}