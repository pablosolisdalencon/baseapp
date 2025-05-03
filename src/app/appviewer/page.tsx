import AppViewerClient from "@/components/AppViewerClient";
import { Suspense } from "react";

export default function AppViewer() {
  return(
    <Suspense><AppViewerClient/></Suspense>
  )
}