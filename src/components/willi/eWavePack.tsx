"use client";

import React, { useEffect, useState } from "react";

import { useSession } from 'next-auth/react'; // Importar useSession correctamente


import {eWavePackComponentProps} from "../../types/marketingWorkflowTypes";
const EWavePack: React.FC<eWavePackComponentProps> = ({ idProyecto, MakerData }) => {
  // Estado para la sesión y el saldo
  const dataMaker=MakerData;
  console.log(idProyecto)
  const { data: session, status } = useSession(); 
  const currentUserEmail = session?.user?.email;
  return(
    <>
    <h1>eWavePack 1 Step Maker</h1>
    <p>Este generador de contenido impulsado por por IA a travez de nuestro agente
         altamente especializado, entre muchas conocimientos técnicos que permiten 
         el mejor rendimiento y efectividad funcional para este caso especifico, Willi,
          nuestro agente, es un verdadero tiburón del Marketing Digital, Está Profunda y actualizadamente entrenado
           en el mercado especifico de tu negocio, y es desde ya el mas erudito en la informacion de tu negocio.
           <br></br>
           Willi, tiene un par de capacidades muy únicas, lo que lo hace muy especial y son lo que da vida a la OLA eWave.
           <br></br>Una de estas capacidades especiales, le permite a Willi de forma muy eficiente aprender, no solo de toda la informacion de tu proyecto y su mercado, 
           sino que cada vez que genera contenido para tu proyecto, lo asimila como informacion de contexto especifico de apoyo para la siguiente creación.
           Lo mas interesante, es que todo lo que genera y lo que aprendde lo estructura de una manera que genera una Perspectiva Total del Proyecto, esto es lo que permite a Willi, 
           generar esos resultados tan coherentes y altamente efectivos en la generacion de contenido para el Marketing Digital de Cada post de tus campañas.
           Willi se convierte en tu experto personalizado en Marketing Digital. 
          
          </p>

          <h2>El Proceso de Creacion del eWave Pack</h2>
          <p>Este proceso es un un servicio exclusivo creado para el lanzamiento de eWave. que ejecuta el Procedimiento de Marketing WorkFlow estandar de eWave sobre tu Proyecto Seleccionado, 
            seguido por la auto Gestion del contenido de la Campaña generada al final, es como si Como usuario ejecutaras manualmente el paso a paso de generacion del Trabajo Estrategico de Marketing, 
            y luego te pasaras al modulo de Gestion de Contenido de Campaña, y generaras todo el contenido de todos los post de la campaña. Solo que Willi lo hará todo por tí mientras 
            disfrutas de tu refresco favorito. pue este flujo completo de trabajo con IA ha sido automatizado para ti, pues a esto nos dedicamos.
          </p>

          <h2>Entonces, Como Genero mi eWavePack ?</h2>
          <h3>Paso 1: Selecciona tu Proyecto</h3>
          <select>
            <option value="000998gyd9sjdbsa98sdjh8kjhasd077" >Proyecto Demo</option>
            <option></option>
          </select>
          <h3>Paso 2: Solicitale a Willi un eWavePack con el siguiente botón.</h3>
          <button type="button">Willi, genera el eWavePack de Proyecto Demo!</button>
    </>
  )

}
export default EWavePack