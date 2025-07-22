"use client"
import { validarSaldo } from "./simpleTokens";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';


const DisplayTokens: React.FC = () => {
  const { data: session } = useSession();
  const [dataSaldo, setDataSaldo] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const fetchSaldo = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await validarSaldo(email);
      if (!res) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      setDataSaldo(res);
    } catch (err: any) {
      setError(`Error al cargar Saldo: ${err.message}`);
      setDataSaldo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userEmail = session?.user?.email;
    if (userEmail) {
      fetchSaldo(userEmail);
    } else {
      setError("No estás autenticado.");
    }
  }, [session]);

  const renderContent = () => {
    if (isLoading) {
      return <span className="coins text-sm font-bold text-white ring-1 rounded p-1 mr-3">...</span>;
    }else{
        
      if (error) {
        return <p>E</p>;
      }else{
            
          if (dataSaldo) {
            return (
              <span className="coins text-sm font-bold text-white ring-1 rounded p-1 mr-3">{dataSaldo}</span>
            );
          } else {
            return <span className="coins text-sm font-bold text-white ring-1 rounded p-1 mr-3">0</span>;
          }
        
      }
    }

  };

  return (
    <>{renderContent()}</>
  );
};

export default DisplayTokens;