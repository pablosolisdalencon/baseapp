import CatalogoClient from "@/components/catalogo-client";
import { Suspense } from "react";

export default function Catalogo() {
  return(
    <Suspense><CatalogoClient/></Suspense>
  )
}