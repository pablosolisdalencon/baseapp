import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import UpdateProyectoClient from "@/components/update-proyecto-client";
import { Suspense } from "react";

export default async function UpdateProyecto() {
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
    <Suspense><UpdateProyectoClient/></Suspense>
  )
}