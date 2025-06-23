import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import dynamic from "next/dynamic";
const AppViewerClient = dynamic(() => import("@/components/AppViewerClient"));

export default async function AppViewer() {
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
    <Suspense><AppViewerClient/></Suspense>
  )
}