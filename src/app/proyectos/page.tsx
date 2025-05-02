import ProyectosClient from "@/components/proyectos-client";
import { Suspense } from "react";

export default function Proyectos() {
  return(
    <Suspense><ProyectosClient/></Suspense>
  )
}