import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProyectosClient from "@/components/proyectos-client";
import { Suspense } from "react";

export default async function Proyectos() {
  const session = await getServerSession(authOptions);
  return(
    <Suspense><ProyectosClient/></Suspense>
  )
}