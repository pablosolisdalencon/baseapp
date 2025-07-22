import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import { PageProps } from "@/types/marketingWorkflowTypes";
import AddItemClient from "@/components/add-item-client";

export default async function DynamicPage({ params }: PageProps) {
  const parametros = await params;
  const { p: idProyecto } = parametros;

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
        <AddItemClient idProyecto={idProyecto}/></Suspense>
  )
}