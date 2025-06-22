"use client"
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

interface SaldoContextProps {
  saldo: number | null;
  setSaldo: (saldo: number | null) => void;
}

const SaldoContext = createContext<SaldoContextProps | undefined>(undefined);

export const SaldoProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [saldo, setSaldo] = useState<number | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchSaldo = async () => {
        const response = await fetch(`/api/user-tokens?e=${session?.user?.email ?? ""}`);
        const data = await response.json();
        setSaldo(data.saldo);
      };
      fetchSaldo();
    }
  }, [session, status]);

  return (
    <SaldoContext.Provider value={{ saldo, setSaldo }}>
      {children}
    </SaldoContext.Provider>
  );
};

export const useSaldo = () => {
  const context = useContext(SaldoContext);
  if (!context) {
    throw new Error("useSaldo must be used within a SaldoProvider");
  }
  return context;
};