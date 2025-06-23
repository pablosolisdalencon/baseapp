import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import AddProyectoClient from "@/components/add-proyecto-client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

export default async function AddProyecto() {
  const session = await getServerSession(authOptions);
  
    if (!session) {
      return (
        <div>
          <p>No estás autenticado. Redirigiendo...</p>
          <meta http-equiv="refresh" content="0; url=/api/auth/signin?callbackUrl=/proyectos" />
        </div>
      );
    }
  return(
        <Suspense fallback={<p>Cargando...</p>}>
          <AddProyectoClient/></Suspense>
  )
}