"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface AppContextProps {
  session: any;
  status: "loading" | "authenticated" | "unauthenticated";
  saldo: number | null;
  setSaldo: (saldo: number | null) => void;
  isSaldoLoading: boolean; // Nuevo estado para la carga del saldo
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }){
  const { data: session, status } = useSession();
  const [saldo, setSaldo] = useState<number | null>(null);
  const [isSaldoLoading, setIsSaldoLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setIsSaldoLoading(true);
      const fetchSaldo = async () => {
        try {
          const response = await fetch(`/api/user-tokens/${session.user?.email}`);
          if (response.ok) {
            const data = await response.json();
            setSaldo(data.tokens);
          } else {
            console.error("AppContext: Error al obtener el saldo (respuesta no OK):", response.statusText);
            // No setear a null aquí directamente. El saldo anterior (si existe) se mantendrá.
            // Si es la primera carga y falla, saldo seguirá siendo null.
          }
        } catch (error) {
          console.error("AppContext: Excepción en fetchSaldo:", error);
          // No setear a null aquí por error de red.
        } finally {
          setIsSaldoLoading(false);
        }
      };
      fetchSaldo();
    } else if (status === "unauthenticated") {
      setSaldo(null); // Limpiar saldo explícitamente si el usuario no está autenticado
      setIsSaldoLoading(false); // No hay saldo que cargar
    } else if (status === "loading") {
      // Cuando la sesión está cargando, indicamos que el saldo también está pendiente.
      // Si ya había un saldo y la sesión revalida (pasa por loading),
      // no queremos borrar el saldo visualmente hasta que sepamos el nuevo estado.
      // setIsSaldoLoading(true); // Esto podría causar que siempre muestre "cargando saldo" al inicio.
      // Es mejor manejarlo en la UI: si status es loading, saldo puede ser el viejo o null.
      // Si saldo es null y status es loading, entonces sí está cargando.
    }
  }, [status, session?.user?.email]);

  return (
    <AppContext.Provider value={{ session, status, saldo, setSaldo, isSaldoLoading }}>
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