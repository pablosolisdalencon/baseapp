import AddItemClient from "@/components/add-item-client";
import { Suspense } from "react";

export default function AddItem() {
  return(
    <Suspense><AddItemClient/></Suspense>
  )
}