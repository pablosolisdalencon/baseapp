"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface AppContextProps {
  session: any; // Ajustar según el tipo de session de next-auth si es necesario
  status: "loading" | "authenticated" | "unauthenticated";
  saldo: number | null;
  setSaldo: (saldo: number | null) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }){
  const { data: session, status } = useSession();
  const [saldo, setSaldo] = useState<number | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchSaldo = async () => {
        try {
          const response = await fetch(`/api/user-tokens/${session.user?.email}`);
          if (response.ok) {
            const data = await response.json();
            setSaldo(data.tokens);
          } else {
            console.error("Error al obtener el saldo:", response.statusText);
            setSaldo(null); // O manejar el error como se prefiera
          }
        } catch (error) {
          console.error("Error en fetchSaldo:", error);
          setSaldo(null); // O manejar el error
        }
      };
      fetchSaldo();
    } else if (status === "unauthenticated") {
      setSaldo(null); // Limpiar saldo si el usuario no está autenticado
    }
  }, [status, session?.user?.email]); // Incluir session?.user?.email en las dependencias

  return (
    <AppContext.Provider value={{ session, status, saldo, setSaldo }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe ser usado dentro de un AppProvider");
  }
  return context;
};