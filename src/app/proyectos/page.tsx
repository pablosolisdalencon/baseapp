import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import ProyectosClient from "@/components/proyectos-client";
import { Suspense } from "react";

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
    <Suspense><ProyectosClient/></Suspense>
  )
}