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
      return <p>...</p>;
    }else{
        
      if (error) {
        return <p>E</p>;
      }

      if (dataSaldo) {
        return (
          <>{dataSaldo}</>
        );
      } else {
        return <>0</>;
      }
    
    }

  };

  return (
    <>{renderContent()}</>
  );
};

export default DisplayTokens;