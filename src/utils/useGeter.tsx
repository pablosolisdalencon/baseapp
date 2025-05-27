'use client';

import { useState, useEffect } from 'react';
import React from 'react'; // Necesario para .tsx


export default async function useGeter(url:string, objectName:string){

    const [object, setObject] = useState<object | null>(null);
    const [loading, setIsLoading] = useState(true);
    const [console, setConsole] = useState<string | null>(null);

    // useEffect(() => {},[])
     useEffect(() => {
        const fetchData = async () => {   
            try{
                const responseGet = await fetch(url); 
                if (!responseGet.ok) {
                setConsole(`Error al llamar a ${url}: ${responseGet}`);
                setIsLoading(false);
                return;
                }else{
                    const dataGet = await responseGet.json();
                    if(!dataGet){
                        setConsole(`Error al leer el JSON: ${dataGet}`);
                        setIsLoading(false);
                        return;
                    }else{
                        setConsole(`${objectName} Obtenido`);
                        setObject(dataGet);
                        setIsLoading(false);
                    } 
                }
            }
            catch(e:any)
            {
                setConsole(`${objectName} NO Obtenido con Error: ${e.message}`);
                setIsLoading(false);
            }
            /* finally {
                setIsLoading(false);
            }*/     
        }
        fetchData();

     },[loading])
     


     if(loading==true){
        //cargando, revisar emensajes
        return { console, null}

     }else{
        // ya cargo
        return(
            <>
            {/* componente consola con el mensaje */}
            
            {/* componente viewer con el objeto */}
            </>
        )

     }
    }
