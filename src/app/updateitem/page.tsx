import UpdateItemClient from "@/components/update-item-client";
import { Suspense } from "react";

export default function UpdateItem() {
  return(
    <Suspense><UpdateItemClient/></Suspense>
  )
}