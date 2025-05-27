import { steps } from "@/ia-utils/workFlow"



/// la logica de este archivo es desplegar y seguir un flujo conmstante configurable
// la definicion del seting estara en ia-utils/workFlow.tsx 
//en cada paso se ejecutara williWork, 
// work usa: geter, maker y saver, display
// work escribe en los componentes: console(mensajeEstado) y viewer(useDisplay) 

//GO

const workFlow = steps;
steps.map((step, index) => {
    work()
})
