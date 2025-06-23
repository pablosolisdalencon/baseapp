import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Carga dinámica del componente cliente
const UpdateProyectoClient = dynamic(() => import("@/components/update-proyecto-client"));

export default async function UpdateProyecto() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin?callbackUrl=/proyectos",
        permanent: false,
      },
    };
  }

  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <UpdateProyectoClient />
    </Suspense>
  );
}