import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import UpdateItemClient from "@/components/update-item-client";
import { UpdateItemPageProps } from "@/types/marketingWorkflowTypes";

export default async function DynamicPage({ params }: UpdateItemPageProps) {
  const parametros = await params;
  const { p: idProyecto, i: idItem, n: nombreProyecto  } = parametros;

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
        <Suspense fallback={<p>Cargando...</p>}><UpdateItemClient idProyecto={idProyecto} nombreProyecto={nombreProyecto} idItem={idItem}/></Suspense>
  )
}