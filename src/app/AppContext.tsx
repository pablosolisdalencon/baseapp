"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface AppContextProps {
  session: any;
  saldo: number | null;
  setSaldo: (saldo: number | null) => void; // Función para actualizar el saldo
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [saldo, setSaldo] = useState<number | null>(null); // Estado local para el saldo

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchSaldo = async () => {
        const response = await fetch(`/api/saldo?email=${session.user?.email}`);
        const data = await response.json();
        setSaldo(data.saldo); // Actualiza el saldo al obtenerlo de la API
      };
      fetchSaldo();
    }
  }, [status, session?.user?.email]);

  return (
    <AppContext.Provider value={{ session, saldo, setSaldo }}>
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