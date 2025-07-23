/*
'use client';
import React from 'react'; // Necesario para .tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import {useTokens,validarSaldo,getPrice} from '../tokens/simpleTokens';

import GWV from '@/utils/GWV';
import {
  EstudioMercadoData,
  EstrategiaMarketingData,
  CampaniaMarketingData,
  WorkflowStep,
} from '../../types/marketingWorkflowTypes'; // Asegúrate de ajustar la ruta

import EstudioMercadoDisplay from './../EstudioMercadoDisplay';
import EstrategiaMarketingDisplay from './../EstrategiaMarketingDisplay';
import CampaniaMarketingDisplay from './../CampaniaMarketingDisplay';
import { useSession } from 'next-auth/react';

// --- Componente principal del Flujo de Marketing ---
interface MarketingWorkflowProps {
  idProyectoD:string | null;
}
  
const MarketingWorkflow: React.FC<MarketingWorkflowProps> = ({idProyectoD}) => {
  const { data: session } = useSession();
  const [idProyecto, setIdProyecto] = useState<string | null>(idProyectoD);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [itemActual, setItemActual] = useState<string | null>(null);
  const [dataItemActual, setDataItemActual] = useState<object | null>(null);
  const [currentUserEmail, setEmail] = useState<string | null>(null);

  const [priceEstudio, setPriceEstudio] = useState<number | null>(null);
  const [priceEstrategia, setPriceEstrategia] = useState<number | null>(null);
  const [priceCampania, setPriceCampania] = useState<number | null>(null);

  // Estados para los datos, ahora tipados con 'null' o el tipo de interfaz
  const [dataEstudioMercado, setDataEstudioMercado] = useState<EstudioMercadoData | null>(null);
  const [dataEstrategiaMarketing, setDataEstrategiaMarketing] = useState<EstrategiaMarketingData | null>(null);
  const [dataCampaniaMarketing, setDataCampaniaMarketing] = useState<CampaniaMarketingData | null>(null);

  // Estados para controlar la existencia en BD (boolean o null inicial)
  const [existeEstudio, setExisteEstudio] = useState<boolean | null>(null);
  const [existeEstrategia, setExisteEstrategia] = useState<boolean | null>(null);
  const [existeCampania, setExisteCampania] = useState<boolean | null>(null);



   // SUITE useTokens
  
            //-------- ACCIONES --------------
            
  
            const ejecutarAccion = async (action:any, objectAction:any) =>{
                
  
                // Para otras acciones, asegurarse que GWV también devuelve una estructura consistente
                // o manejar los errores de forma similar.
                if (action === "generate-estudio") {
                    const { mode, projectId, item } = objectAction;
                    try {
                        const result = await GWV(mode, projectId, item); // Asumir que GWV puede lanzar error o devolver null/estructura
                        return result; // o { key: "estudio_key", generated: result } si es necesario adaptar
                    } catch (error:any) {
                        return { key: "estudio_error", generated: { texto: `Error: ${error.message}` } }; // Ejemplo
                    }
                }
                if (action === "generate-estrategia") {
                    const { mode, projectId, item, estudio } = objectAction;
                    try {
                        const result = await GWV(mode, projectId, item, estudio);
                        return result;
                    } catch (error:any) {
                        return { key: "estrategia_error", generated: { texto: `Error: ${error.message}` } };
                    }
                }
                if (action === "generate-campania") {
                    const { mode, projectId, item, estudio, estrategia } = objectAction;
                    try {
                        const result = await GWV(mode, projectId, item, estudio, estrategia);
                        return result;
                    } catch (error:any) {
                        return { key: "campania_error", generated: { texto: `Error: ${error.message}` } };
                    }
                }
                return null; // O una estructura de error por defecto
            }
  
            // displayTokensModal no se usa actualmente, se podría eliminar o implementar si es necesario.
  
            // -----------------------------------------------
            const getPrice = async (action:any) => {
                if (!action) {
                    return null;
                }
                try {
                    const response = await fetch(`/api/pricing?a=${action}`); // No necesita headers ni method GET por defecto
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({})); // Intenta parsear JSON, si falla, objeto vacío
                        // No usar alert aquí, mejor propagar el error o null.
                        return null;
                    }
                    const jsonPrice = await response.json();
                    return jsonPrice.price; // Asume que la API devuelve { price: X }
                } catch (e) {
                    return null;
                }
            }
            // -----------------------------------------------
  
            const validarSaldo = async (currentUserEmail:any) => {
                if (!currentUserEmail) {
                    return null;
                }
                try {
                    // El endpoint es /api/user-tokens/[email], no necesita query param 'e=' si se ajusta la API
                    // Asumiendo que la API está en /api/user-tokens/[email]
                    const response = await fetch(`/api/user-tokens/?e=${currentUserEmail}`);
                    if (!response.ok) {
                        return null;
                    }
                    const jsonData = await response.json();
                    return jsonData.tokens; // Asume { tokens: Y }
                } catch (e) {
                    return null;
                }
            }
            // -----------------------------------------------
  
            const descontarTokens = async (montoADejar:number, currentUserEmail:string) => {
                // El 'monto' aquí es el saldo final después del descuento, no la cantidad a descontar.
                // La API /api/user-tokens (PUT) debe estar diseñada para SETear el saldo.
       
  
  
                const bodyData = JSON.stringify({ tokens: montoADejar, email:currentUserEmail }); // La API debe interpretar esto como el nuevo saldo
                try {
                    const response = await fetch(`/api/user-tokens`, { // Asumiendo API RESTful
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: bodyData,
                    });
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        return null; // O false
                    }
                    return await response.json(); // O true si la API devuelve el usuario actualizado o un success
                } catch (e) {
                    return null; // O false
                }
            }
            // -----------------------------------------------
  
            // historyTokens no se usa, se podría eliminar.
  
            // -----------------------------------------------
  
            const rollBackTokens = async (saldoOriginal:any, currentUserEmail:any) => {
                // Esta función es esencialmente la misma que descontarTokens si la API SETea el saldo.
                console.log(`rollBackTokens: Restaurando saldo a ${saldoOriginal} para ${currentUserEmail}`);
                return await descontarTokens(saldoOriginal, currentUserEmail); // Reutilizar descontarTokens
            }
  
            // main?
            const useTokens = async (action:any, objectAction:any) => {
                
                if (currentUserEmail) {
                    const saldoActual = await validarSaldo(currentUserEmail);
  
                    
  
                    const price = await getPrice(action);
                    if (price === null) { // getPrice ahora devuelve null en error
                        return { key: action, generated: { texto: `Error: No se pudo determinar el costo de la acción.`, imagen: null } };
                    }
  
                    
                    if (saldoActual === null) {
                        return { key: action, generated: { texto: `Error: No se pudo verificar el saldo.`, imagen: null } };
                    }
  
                    if (saldoActual >= price) {
                        const saldoDespuesDelDescuento = saldoActual - price;
                        const descuentoExitoso = await descontarTokens(saldoDespuesDelDescuento, currentUserEmail);
  
                        if (descuentoExitoso) { // Asumiendo que descontarTokens devuelve algo truthy en éxito
                            const resultadoAccion = await ejecutarAccion(action, objectAction);
  
                            // Verificar si la acción falló (ej. resultadoAccion.generated.texto contiene "Error:")
                            if (resultadoAccion && resultadoAccion.generated && typeof resultadoAccion.generated.texto === 'string' && resultadoAccion.generated.texto.startsWith("Error:")) {
                                await rollBackTokens(saldoActual, currentUserEmail); // Devolver tokens al saldo original
                                return resultadoAccion; // Devolver el error de la acción
                            }
  
                            if (resultadoAccion && resultadoAccion.key != null) { // Chequeo más robusto
                                return resultadoAccion;
                            } else {
                                await rollBackTokens(saldoActual, currentUserEmail); // Devolver tokens al saldo original
                                return {
                                    key: action,
                                    generated: {
                                        texto: "Oops! Fallo en la generación de contenido. Tus tokens han sido restaurados. Inténtalo de nuevo.",
                                        imagen: null
                                    }
                                };
                            }
                        } else {
                        return { key: action, generated: { texto: `Error: No se pudieron descontar los tokens ^saldoDespuesDelDescuento:${saldoDespuesDelDescuento}, currentUserEmail: ${currentUserEmail}.`, imagen: null } };
                        }
                    } else {
                        return { key: action, generated: { texto: "Saldo Insuficiente.", imagen: null } }; // Estructura consistente
                    }
                }
            }
  

  
  const saveGenData = async () => {
    let item = itemActual;
    let bodyData = dataItemActual;
    console.log(`######### saveGenData ItemActual #########`)
    console.log(itemActual)
    console.log(`######### saveGenData dataItemActual  #########`)
    console.log(dataItemActual)
      const res = await fetch(`api/${item}?p=${idProyecto}`,  {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if(data){
        console.log(data);
        alert(item+' guardado correctamente!');
        if(item=="estudio-mercado"){
          setExisteEstudio(true); // Marca como existente en BD tras guardar
          setCurrentStep(2);
        }else if(item=="estrategia-marketing"){
          setExisteEstrategia(true); // Marca como existente en BD tras guardar
          setCurrentStep(3);
        }else if(item=="campania-marketing"){
          setExisteCampania(true); // Marca como existente en BD tras guardar
        }
      }else{
        alert(item+' Oops! no se ha guardado '+item)
      }
      
      
      
    };

  // Efecto para verificar existencia de datos cuando cambia el paso
  
  useEffect(() => {
     setIdProyecto(idProyectoD)
    

    const projectId=idProyecto;

    //console.log(`######### useEffect  projectId  ${projectId}  #########`)
        

    const checkExistence = async () => {
      setIsLoading(true);
      setError(null);
      

      try {
        if (currentStep === 1) {
          
          setItemActual("estudio-mercado")
          const estudioExistente = await GWV('check',projectId,"estudio-mercado");
          setExisteEstudio(!!estudioExistente);
          //console.log(`######### checkExistence  estudioExistente  ${estudioExistente}  #########`)
          if (estudioExistente) {
            //console.log(`#$######## checkExistence  estudioExistente  ${estudioExistente}  #########`)
            setDataEstudioMercado(estudioExistente);
          }
        } else if (currentStep === 2) {
          setItemActual("estrategia-marketing")
          const estrategiaExistente = await GWV('check',projectId,"estrategia-marketing");
          setExisteEstrategia(!!estrategiaExistente);
          if (estrategiaExistente) {
            setDataEstrategiaMarketing(estrategiaExistente);
          }
        } else if (currentStep === 3) {
          setItemActual("campania-marketing")
          const campaniaExistente = await GWV('check',projectId,"campania-marketing");
          setExisteCampania(!!campaniaExistente);
          if (campaniaExistente) {
            setDataCampaniaMarketing(campaniaExistente);
          }
        }
      } catch (err: any) {
        setError("Error al verificar datos existentes: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Solo ejecuta la verificación si no estamos ya cargando
    if (!isLoading) {
      checkExistence();
    }
  }, [currentStep, idProyecto]); // Añadir isLoading a las dependencias si quieres re-ejecutar en cambios de carga

  useEffect(() => {
      const getEstudioPrice = async () => {
        const responsePrice = await getPrice("generate-estudio")
        if(responsePrice){
          setPriceEstudio(responsePrice)
        }
      }
      getEstudioPrice();
    

    const getEstrategiaPrice = async () => {
      const responsePrice = await getPrice("generate-estrategia")
      if(responsePrice){
        setPriceEstrategia(responsePrice)
      }
    }
    getEstrategiaPrice();

    const getCampaniaPrice = async () => {
      const responsePrice = await getPrice("generate-campania")
      if(responsePrice){
        setPriceCampania(responsePrice)
      }
    }
    getCampaniaPrice();
  
  },[]);

  
  
  const handleGenerateEstudio = async () => {
    setEmail(session?.user?.email as string)
    setIsLoading(true);
    setError(null);

    try {

      setItemActual("estudio-mercado");
      // Obtener el precio de los tokens para esta acción
      const price = await getPrice("generate-estudio");
      if (!price) throw new Error("No se pudo obtener el precio de los tokens.");
      setPriceEstudio(price)
      // Consumir tokens y generar el estudio
      const itemObjectEstudio = {
        mode: 'generate',
        id: idProyecto, 
        item: "estudio-mercado"
      }
      
      const estudioData = await useTokens("generate-estudio",itemObjectEstudio)
      setDataEstudioMercado(estudioData?.generated as EstudioMercadoData);
      setDataItemActual(estudioData?.generated as EstudioMercadoData);
      // Actualizar el saldo después de consumir tokens
      //const updatedSaldo = await validarSaldo(session?.user?.email as string);
    } catch (err: any) {
      setError("Error al generar estudio de mercado: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateEstrategia = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Asegúrate de que dataEstudioMercado no sea null antes de pasarlo
      if (!dataEstudioMercado) {
        throw new Error("Estudio de mercado es requerido para generar estrategia.");
      }
      setItemActual("estrategia-marketing");

      // Obtener el precio de los tokens para esta acción
      const price = await getPrice("generate-estrategia");
      if (!price) throw new Error("No se pudo obtener el precio de los tokens.");
      setPriceEstrategia(price)
      // Consumir tokens y generar la estrategia
      const itemObjectEstrategia = {
        mode: 'generate',
        id: idProyecto, 
        item: "estrategia-marketing", 
        estudio: dataEstudioMercado
      }
      const estrategiaData = await useTokens("generate-estrategia",itemObjectEstrategia)

      setDataEstrategiaMarketing(estrategiaData?.generated as EstrategiaMarketingData);
      setDataItemActual(estrategiaData?.generated as EstrategiaMarketingData);
  
    } catch (err: any) {
      setError("Error al generar estrategia de marketing: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCampania = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Asegúrate de que dataEstrategiaMarketing no sea null
      if (!dataEstrategiaMarketing) {
        throw new Error("Estrategia de marketing es requerida para generar campaña.");
      }
      setItemActual("campania-marketing");
      // Obtener el precio de los tokens para esta acción
      const price = await getPrice("generate-campania");
      if (!price) throw new Error("No se pudo obtener el precio de los tokens.");
      setPriceCampania(price)
      // Consumir tokens y generar la campaña
      const itemObjectCampania = {
        mode: 'generate',
        id: idProyecto, 
        item: "campania-marketing", 
        estudio: dataEstudioMercado,
        estrategia: dataEstrategiaMarketing
      }
      const campaniaData = await useTokens("generate-campania",itemObjectCampania)
      setDataCampaniaMarketing(campaniaData?.generated as CampaniaMarketingData);
      setDataItemActual(campaniaData?.generated as CampaniaMarketingData);

    } catch (err: any) {
      setError("Error al generar campaña de marketing: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const steps: WorkflowStep[] = [
    { number: 1, title: "Estudio de Mercado", completed: !!dataEstudioMercado },
    { number: 2, title: "Estrategia de Marketing", completed: !!dataEstrategiaMarketing },
    { number: 3, title: "Campaña de Marketing", completed: !!dataCampaniaMarketing }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Flujo de Trabajo de Marketing
        </h1>

        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">
            Proyecto ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{idProyecto}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                  ${step.number === currentStep ? 'bg-blue-600 ring-4 ring-blue-200' :
                    step.completed ? 'bg-green-600' : 'bg-gray-300'}`}>
                  {step.completed ? '✓' : step.number}
                </div>
                <span className={`text-sm mt-2 text-center ${step.number === currentStep ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mt-4 mx-2 ${step.completed ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Procesando...</span>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Paso 1: Estudio de Mercado</h2>
            <img src="/step1.png" className="flow-img"/>

            {existeEstudio === null && !isLoading && (
              <div className="text-center py-4">
                <div className="animate-pulse">Verificando datos existentes...</div>
              </div>
            )}

            {existeEstudio === true && dataEstudioMercado && (
              <div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <p className="text-green-700">Estudio de mercado existente encontrado</p>
                </div>
                <EstudioMercadoDisplay Input={dataEstudioMercado} />
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Continuar al Paso 2
                </button>
              </div>
            )}

            {existeEstudio === false && !dataEstudioMercado && !isLoading && (
              <div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                  <p className="text-yellow-700">No se encontró estudio de mercado existente</p>
                </div>
                <button
                  onClick={handleGenerateEstudio}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Generar Estudio de Mercado 🪙 {priceEstudio || '...'}
                </button>
              </div>
            )}

            {dataEstudioMercado && existeEstudio === false && (
              <EstudioMercadoDisplay
                Input={dataEstudioMercado}
                onSave={saveGenData}
                showSaveButton={true}
              />
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Paso 2: Estrategia de Marketing</h2>
            <img src="/step2.png" className="flow-img"/>

            {existeEstrategia === null && !isLoading && (
              <div className="text-center py-4">
                <div className="animate-pulse">Verificando datos existentes...</div>
              </div>
            )}

            {existeEstrategia === true && dataEstrategiaMarketing && (
              <div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <p className="text-green-700">Estrategia de marketing existente encontrada</p>
                </div>
                <EstrategiaMarketingDisplay Input={dataEstrategiaMarketing} />
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Continuar al Paso 3
                </button>
              </div>
            )}

            {existeEstrategia === false && !dataEstrategiaMarketing && !isLoading && (
              <div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                  <p className="text-yellow-700">No se encontró estrategia de marketing existente</p>
                </div>
                <button
                  onClick={handleGenerateEstrategia}
                  disabled={!dataEstudioMercado || isLoading}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    !dataEstudioMercado || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Generar Estrategia de Marketing 🪙 {priceEstrategia || '...'}
                </button>
                {!dataEstudioMercado && (
                  <p className="text-sm text-gray-500 mt-2">
                    Necesitas completar el Estudio de Mercado primero
                  </p>
                )}
              </div>
            )}

            {dataEstrategiaMarketing && existeEstrategia === false && (
              <EstrategiaMarketingDisplay
                Input={dataEstrategiaMarketing}
                onSave={saveGenData}
                showSaveButton={true}
              />
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Paso 3: Campaña de Marketing</h2>
            <img src="/step3.png" className="flow-img"/>

            {existeCampania === null && !isLoading && (
              <div className="text-center py-4">
                <div className="animate-pulse">Verificando datos existentes...</div>
              </div>
            )}

            {existeCampania === true && dataCampaniaMarketing && (
              <div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <p className="text-green-700">Campaña de marketing existente encontrada</p>
                </div>
                <CampaniaMarketingDisplay Input={dataCampaniaMarketing} />
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                  <p className="text-blue-700">¡Flujo de trabajo completado exitosamente!</p>
                </div>
              </div>
            )}

            {existeCampania === false && !dataCampaniaMarketing && !isLoading && (
              <div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                  <p className="text-yellow-700">No se encontró campaña de marketing existente</p>
                </div>
                <button
                  onClick={handleGenerateCampania}
                  disabled={!dataEstrategiaMarketing || isLoading}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    !dataEstrategiaMarketing || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Generar Campaña de Marketing 🪙 {priceCampania || '...'}
                </button>
                {!dataEstrategiaMarketing && (
                  <p className="text-sm text-gray-500 mt-2">
                    Necesitas completar la Estrategia de Marketing primero
                  </p>
                )}
              </div>
            )}

            {dataCampaniaMarketing && existeCampania === false && (
              <div>
                <CampaniaMarketingDisplay
                  Input={dataCampaniaMarketing}
                  onSave={saveGenData}
                  showSaveButton={true}
                />
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                  <img src="/step4.png" className="flow-img"/>
                  <p className="text-blue-700">¡Campaña generada! Guarda para completar el flujo.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isLoading}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentStep === 1 || isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Paso Anterior
          </button>

          <button
            onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
            disabled={currentStep === 3 || isLoading}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentStep === 3 || isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Siguiente Paso
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketingWorkflow;
*/

// components/willi/StepByStepWilli.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  CampaniaMarketingData, 
  EstudioMercadoData, 
  EstrategiaMarketingData,
  MakerData // Si se usa en este componente
} from '@/types/marketingWorkflowTypes';

// Importa tus componentes de display (EstudioMercadoDisplay, EstrategiaMarketingDisplay, CampaniaMarketingDisplay)
import EstudioMercadoDisplay from '@/components/EstudioMercadoDisplay';
import EstrategiaMarketingDisplay from '@/components/EstrategiaMarketingDisplay';
import CampaniaMarketingDisplay from '@/components/CampaniaMarketingDisplay';


interface MarketingWorkflowProps {
  idProyectoD: string;
  initialEstudioData: EstudioMercadoData | null;
  initialEstrategiaData: EstrategiaMarketingData | null;
  initialCampaniaData: CampaniaMarketingData | null;
  // initialMakerData?: MakerData | null; // Opcional, si se necesita

  // Tipos para las Server Actions que se reciben como props
  onGenerateEstudio: (projectId: string) => Promise<EstudioMercadoData | null>;
  onSaveEstudio: (projectId: string, data: EstudioMercadoData) => Promise<boolean>;
  onGenerateEstrategia: (projectId: string, estudio: EstudioMercadoData | null) => Promise<EstrategiaMarketingData | null>;
  onSaveEstrategia: (projectId: string, data: EstrategiaMarketingData) => Promise<boolean>;
  onGenerateCampania: (projectId: string, estudio: EstudioMercadoData | null, estrategia: EstrategiaMarketingData | null) => Promise<CampaniaMarketingData | null>;
  onSaveCampania: (projectId: string, data: CampaniaMarketingData) => Promise<boolean>;
}

const MarketingWorkflow: React.FC<MarketingWorkflowProps> = ({
  idProyectoD,
  initialEstudioData,
  initialEstrategiaData,
  initialCampaniaData,
  // initialMakerData, // Si se usa

  onGenerateEstudio,
  onSaveEstudio,
  onGenerateEstrategia,
  onSaveEstrategia,
  onGenerateCampania,
  onSaveCampania,
}) => {
  const [estudioData, setEstudioData] = useState<EstudioMercadoData | null>(initialEstudioData);
  const [estrategiaData, setEstrategiaData] = useState<EstrategiaMarketingData | null>(initialEstrategiaData);
  const [campaniaData, setCampaniaData] = useState<CampaniaMarketingData | null>(initialCampaniaData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funciones de manejo para los botones de generación y guardado
  const handleGenerateEstudio = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generated = await onGenerateEstudio(idProyectoD);
      if (generated) {
        setEstudioData(generated);
        alert('Estudio de Mercado generado exitosamente!');
      } else {
        setError('Falló la generación del Estudio de Mercado.');
      }
    } catch (err: any) {
      setError(`Error al generar estudio: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEstudio = async () => {
    if (!estudioData) {
      alert('No hay estudio para guardar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const success = await onSaveEstudio(idProyectoD, estudioData);
      if (success) {
        alert('Estudio de Mercado guardado exitosamente!');
      } else {
        setError('Falló al guardar el Estudio de Mercado.');
      }
    } catch (err: any) {
      setError(`Error al guardar estudio: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Repite estas funciones de manejo para Estrategia y Campaña
  const handleGenerateEstrategia = async () => {
    if (!estudioData) {
      alert('Necesitas un Estudio de Mercado para generar la Estrategia.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const generated = await onGenerateEstrategia(idProyectoD, estudioData);
      if (generated) {
        setEstrategiaData(generated);
        alert('Estrategia de Marketing generada exitosamente!');
      } else {
        setError('Falló la generación de la Estrategia de Marketing.');
      }
    } catch (err: any) {
      setError(`Error al generar estrategia: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEstrategia = async () => {
    if (!estrategiaData) {
      alert('No hay estrategia para guardar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const success = await onSaveEstrategia(idProyectoD, estrategiaData);
      if (success) {
        alert('Estrategia de Marketing guardada exitosamente!');
      } else {
        setError('Falló al guardar la Estrategia de Marketing.');
      }
    } catch (err: any) {
      setError(`Error al guardar estrategia: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCampania = async () => {
    if (!estudioData || !estrategiaData) {
      alert('Necesitas un Estudio y una Estrategia para generar la Campaña.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const generated = await onGenerateCampania(idProyectoD, estudioData, estrategiaData);
      if (generated) {
        setCampaniaData(generated);
        alert('Campaña de Marketing generada exitosamente!');
      } else {
        setError('Falló la generación de la Campaña de Marketing.');
      }
    } catch (err: any) {
      setError(`Error al generar campaña: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCampania = async () => {
    if (!campaniaData) {
      alert('No hay campaña para guardar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const success = await onSaveCampania(idProyectoD, campaniaData);
      if (success) {
        alert('Campaña de Marketing guardada exitosamente!');
      } else {
        setError('Falló al guardar la Campaña de Marketing.');
      }
    } catch (err: any) {
      setError(`Error al guardar campaña: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Aquí iría tu lógica para determinar el paso actual o el flujo del "step by step"
  // ...

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading && <p>Cargando/Procesando...</p>}

      {/* Paso 1: Estudio de Mercado */}
      <section>
        <h3>Paso 1: Estudio de Mercado</h3>
        {estudioData ? (
          <>
            <EstudioMercadoDisplay Input={estudioData} />
            <button
              onClick={handleSaveEstudio}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              Guardar Estudio de Mercado
            </button>
          </>
        ) : (
          <button
            onClick={handleGenerateEstudio}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            disabled={isLoading}
          >
            Generar Estudio de Mercado
          </button>
        )}
      </section>

      {/* Paso 2: Estrategia de Marketing (solo si existe Estudio) */}
      {estudioData && (
        <section className="mt-8">
          <h3>Paso 2: Estrategia de Marketing</h3>
          {estrategiaData ? (
            <>
              <EstrategiaMarketingDisplay Input={estrategiaData} />
              <button
                onClick={handleSaveEstrategia}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                Guardar Estrategia de Marketing
              </button>
            </>
          ) : (
            <button
              onClick={handleGenerateEstrategia}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              disabled={isLoading}
            >
              Generar Estrategia de Marketing
            </button>
          )}
        </section>
      )}

      {/* Paso 3: Campaña de Marketing (solo si existe Estrategia) */}
      {estrategiaData && (
        <section className="mt-8">
          <h3>Paso 3: Campaña de Marketing</h3>
          {campaniaData ? (
            <>
              <CampaniaMarketingDisplay Input={campaniaData} />
              <button
                onClick={handleSaveCampania}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                Guardar Campaña de Marketing
              </button>
            </>
          ) : (
            <button
              onClick={handleGenerateCampania}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              disabled={isLoading}
            >
              Generar Campaña de Marketing
            </button>
          )}
        </section>
      )}

      {/* Puedes agregar más lógica de UI para el flujo de pasos, etc. */}
    </div>
  );
};

export default MarketingWorkflow;