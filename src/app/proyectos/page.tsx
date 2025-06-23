import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import ProyectosClient from "@/components/proyectos-client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
const UpdateProyectoClient = dynamic(() => import("@/components/update-proyecto-client"));

export default async function Proyectos() {
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
      <ProyectosClient/></Suspense>
  )
}