'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { useSession, getSession } from 'next-auth/react'; // Added

import React from 'react'; // Necesario para .tsx
import GWV from '@/utils/GWV';
import {
  MakerData,
  EstudioMercadoData,
  EstrategiaMarketingData,
  CampaniaMarketingData,
  WilliAPIResponse,
  WorkflowStep,
} from '../../types/marketingWorkflowTypes'; // Asegúrate de ajustar la ruta

import EstudioMercadoDisplay from './../EstudioMercadoDisplay';
import EstrategiaMarketingDisplay from './../EstrategiaMarketingDisplay';
import CampaniaMarketingDisplay from './../CampaniaMarketingDisplay';

// --- Componente principal del Flujo de Marketing ---
interface MarketingWorkflowProps {
  idProyecto?: string;
}

  
  
const MarketingWorkflow: React.FC<MarketingWorkflowProps> = () => {
  const searchParams = useSearchParams();
  const idProyecto = searchParams.get('id');
  const { data: session } = useSession(); // update: updateSession can be used if needed

  const [userTokens, setUserTokens] = useState<number | null>(null);
  const [prices, setPrices] = useState<{ [key: string]: number | null }>({
    'generar estudio': null,
    'generar estrategia': null,
    'generar campania': null,
  });
  const [priceError, setPriceError] = useState<string | null>(null);
  const [pricesLoading, setPricesLoading] = useState<boolean>(true);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false); // This is for individual generation loading
  const [error, setError] = useState<string | null>(null);

  const [itemActual, setItemActual] = useState<string | null>(null);
  const [dataItemActual, setDataItemActual] = useState<object | null>(null);

  // Estados para los datos, ahora tipados con 'null' o el tipo de interfaz
  const [dataEstudioMercado, setDataEstudioMercado] = useState<EstudioMercadoData | null>(null);
  const [dataEstrategiaMarketing, setDataEstrategiaMarketing] = useState<EstrategiaMarketingData | null>(null);
  const [dataCampaniaMarketing, setDataCampaniaMarketing] = useState<CampaniaMarketingData | null>(null);

  // Estados para controlar la existencia en BD (boolean o null inicial)
  const [existeEstudio, setExisteEstudio] = useState<boolean | null>(null);
  const [existeEstrategia, setExisteEstrategia] = useState<boolean | null>(null);
  const [existeCampania, setExisteCampania] = useState<boolean | null>(null);

  
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
    if (session && session.user && (session.user as any).tokens !== undefined) {
      setUserTokens((session.user as any).tokens);
    }
  }, [session]);

  useEffect(() => {
    const fetchPrices = async () => {
      setPricesLoading(true);
      setPriceError(null);
      try {
        const actionNames = ['generar estudio', 'generar estrategia', 'generar campania'];
        const fetchedPricesUpdate: { [key: string]: number | null } = {};
        for (const actionName of actionNames) {
          const res = await fetch(`/api/precios?actionName=${encodeURIComponent(actionName)}`);
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch price for ${actionName}: ${res.statusText}`);
          }
          const data = await res.json();
          // Assuming API returns a single object if actionName is provided and found, or an array if not specific.
          if (Array.isArray(data)) {
            const priceDetail = data.find(p => p.actionName === actionName);
            fetchedPricesUpdate[actionName] = priceDetail ? priceDetail.price : null;
          } else if (data && data.price !== undefined && data.actionName === actionName) {
            fetchedPricesUpdate[actionName] = data.price;
          } else {
            // If API returns all prices even with actionName query, filter here
            const allPrices = await (await fetch('/api/precios')).json();
            if(Array.isArray(allPrices)){
                const priceDetail = allPrices.find(p => p.actionName === actionName);
                fetchedPricesUpdate[actionName] = priceDetail ? priceDetail.price : null;
            } else {
                fetchedPricesUpdate[actionName] = null;
            }
          }
          if (fetchedPricesUpdate[actionName] === null) console.warn(`Price for ${actionName} not found or in unexpected format.`);
        }
        setPrices(fetchedPricesUpdate);
      } catch (err) {
        console.error("Error fetching prices:", err);
        setPriceError(err instanceof Error ? err.message : "Could not load action prices.");
      } finally {
        setPricesLoading(false);
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const projectId = idProyecto;
    const checkExistence = async () => {
      setIsLoading(true); // This isLoading seems to be for the step loading, not price loading.
      setError(null);
      try {
        let currentItemKey = "";
        if (currentStep === 1) currentItemKey = "estudio-mercado";
        else if (currentStep === 2) currentItemKey = "estrategia-marketing";
        else if (currentStep === 3) currentItemKey = "campania-marketing";

        if (currentItemKey) {
          setItemActual(currentItemKey);
          const existingData = await GWV('check', projectId, currentItemKey);
          if (currentStep === 1) {
            setExisteEstudio(!!existingData);
            if (existingData) setDataEstudioMercado(existingData);
          } else if (currentStep === 2) {
            setExisteEstrategia(!!existingData);
            if (existingData) setDataEstrategiaMarketing(existingData);
          } else if (currentStep === 3) {
            setExisteCampania(!!existingData);
            if (existingData) setDataCampaniaMarketing(existingData);
          }
        }
      } catch (err: any) {
        setError("Error al verificar datos existentes: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (idProyecto) { // Only run if idProyecto is available
      checkExistence();
    }
  }, [currentStep, idProyecto]);


  const handleTokenUpdate = async (responseData: any) => {
    const resultData = Array.isArray(responseData) ? responseData[0] : responseData;
    if (resultData && resultData.newTokens !== undefined) {
      setUserTokens(resultData.newTokens);
      // Optional: Update session more directly if needed, though getSession is safer
      // await updateSession({ user: { ...(session?.user), tokens: resultData.newTokens } });
      const updatedSession = await getSession(); // Refetch session to ensure sync
      if (updatedSession && updatedSession.user && (updatedSession.user as any).tokens !== undefined) {
        setUserTokens((updatedSession.user as any).tokens);
      }
    } else {
      const updatedSession = await getSession();
      if (updatedSession && updatedSession.user && (updatedSession.user as any).tokens !== undefined) {
        setUserTokens((updatedSession.user as any).tokens);
      }
    }
  };

  const handleGenerateEstudio = async () => {
    const actionName = "generar estudio";
    const currentPrice = prices[actionName];

    if (pricesLoading) {
      setError("Cargando precios, por favor espera...");
      return;
    }
    if (priceError || currentPrice === null || currentPrice === undefined) {
      setError(priceError || `No se pudo determinar el costo para ${actionName}.`);
      return;
    }
    if (userTokens === null || userTokens < currentPrice) {
      setError(`No tienes suficientes tokens para ${actionName}. Necesitas ${currentPrice}, tienes ${userTokens ?? 0}.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setItemActual("estudio-mercado");
      const estudioData = await GWV('generate', idProyecto, "estudio-mercado");
      await handleTokenUpdate(estudioData);
      setDataEstudioMercado(Array.isArray(estudioData) ? estudioData[0] as EstudioMercadoData : estudioData as EstudioMercadoData);
      setDataItemActual(Array.isArray(estudioData) ? estudioData[0] as EstudioMercadoData : estudioData as EstudioMercadoData);
    } catch (err: any) {
      setError("Error al generar estudio de mercado: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateEstrategia = async () => {
    const actionName = "generar estrategia";
    const currentPrice = prices[actionName];

    if (pricesLoading) {
      setError("Cargando precios, por favor espera...");
      return;
    }
    if (priceError || currentPrice === null || currentPrice === undefined) {
      setError(priceError || `No se pudo determinar el costo para ${actionName}.`);
      return;
    }
    if (userTokens === null || userTokens < currentPrice) {
      setError(`No tienes suficientes tokens para ${actionName}. Necesitas ${currentPrice}, tienes ${userTokens ?? 0}.`);
      return;
    }
    if (!dataEstudioMercado) {
      setError("Estudio de mercado es requerido para generar estrategia.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setItemActual("estrategia-marketing");
      const estrategiaData = await GWV('generate', idProyecto, "estrategia-marketing", dataEstudioMercado);
      await handleTokenUpdate(estrategiaData);
      setDataEstrategiaMarketing(Array.isArray(estrategiaData) ? estrategiaData[0] as EstrategiaMarketingData : estrategiaData as EstrategiaMarketingData);
      setDataItemActual(Array.isArray(estrategiaData) ? estrategiaData[0] as EstrategiaMarketingData : estrategiaData as EstrategiaMarketingData);
    } catch (err: any) {
      setError("Error al generar estrategia de marketing: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCampania = async () => {
    const actionName = "generar campania";
    const currentPrice = prices[actionName];

    if (pricesLoading) {
      setError("Cargando precios, por favor espera...");
      return;
    }
    if (priceError || currentPrice === null || currentPrice === undefined) {
      setError(priceError || `No se pudo determinar el costo para ${actionName}.`);
      return;
    }
    if (userTokens === null || userTokens < currentPrice) {
      setError(`No tienes suficientes tokens para ${actionName}. Necesitas ${currentPrice}, tienes ${userTokens ?? 0}.`);
      return;
    }
    if (!dataEstrategiaMarketing) {
      setError("Estrategia de marketing es requerida para generar campaña.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setItemActual("campania-marketing");
      const campaniaData = await GWV('generate', idProyecto, "campania-marketing", dataEstudioMercado, dataEstrategiaMarketing);
      await handleTokenUpdate(campaniaData);
      setDataCampaniaMarketing(Array.isArray(campaniaData) ? campaniaData[0] as CampaniaMarketingData : campaniaData as CampaniaMarketingData);
      setDataItemActual(Array.isArray(campaniaData) ? campaniaData[0] as CampaniaMarketingData : campaniaData as CampaniaMarketingData);
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

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md shadow-sm">
          <p className="text-md font-semibold text-blue-700">
            Tokens disponibles: {userTokens !== null ? userTokens : 'Cargando...'}
          </p>
          {pricesLoading && <p className="text-sm text-blue-600">Cargando costos de acciones...</p>}
          {priceError && <p className="text-sm text-red-600">Error al cargar costos: {priceError}</p>}
        </div>

        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">
            Proyecto ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{idProyecto}</span>
          </div>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1"> {/* flex-1 para distribuir espacio */}
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

        {/* Paso 1: Estudio de Mercado */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Paso 1: Estudio de Mercado</h2>

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
                  <p className="text-yellow-700">No se encontró estudio de mercado existente.</p>
                  {!pricesLoading && prices['generar estudio'] !== null && (
                    <p className="text-yellow-600 text-sm">Costo: {prices['generar estudio']} tokens</p>
                  )}
                </div>
                <button
                  onClick={handleGenerateEstudio}
                  disabled={isLoading || pricesLoading || userTokens === null || userTokens < (prices['generar estudio'] ?? Infinity)}
                  className={`bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors
                    ${(isLoading || pricesLoading || userTokens === null || userTokens < (prices['generar estudio'] ?? Infinity)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Generar Estudio de Mercado
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

        {/* Paso 2: Estrategia de Marketing */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Paso 2: Estrategia de Marketing</h2>

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
                  <p className="text-yellow-700">No se encontró estrategia de marketing existente.</p>
                  {!pricesLoading && prices['generar estrategia'] !== null && (
                    <p className="text-yellow-600 text-sm">Costo: {prices['generar estrategia']} tokens</p>
                  )}
                </div>
                <button
                  onClick={handleGenerateEstrategia}
                  disabled={!dataEstudioMercado || isLoading || pricesLoading || userTokens === null || userTokens < (prices['generar estrategia'] ?? Infinity)}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    (!dataEstudioMercado || isLoading || pricesLoading || userTokens === null || userTokens < (prices['generar estrategia'] ?? Infinity))
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Generar Estrategia de Marketing
                </button>
                {!dataEstudioMercado && (
                  <p className="text-sm text-gray-500 mt-2">
                    Necesitas completar el Estudio de Mercado primero.
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

        {/* Paso 3: Campaña de Marketing */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Paso 3: Campaña de Marketing</h2>

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
                  <p className="text-yellow-700">No se encontró campaña de marketing existente.</p>
                  {!pricesLoading && prices['generar campania'] !== null && (
                    <p className="text-yellow-600 text-sm">Costo: {prices['generar campania']} tokens</p>
                  )}
                </div>
                <button
                  onClick={handleGenerateCampania}
                  disabled={!dataEstrategiaMarketing || isLoading || pricesLoading || userTokens === null || userTokens < (prices['generar campania'] ?? Infinity)}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    (!dataEstrategiaMarketing || isLoading || pricesLoading || userTokens === null || userTokens < (prices['generar campania'] ?? Infinity))
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Generar Campaña de Marketing
                </button>
                {!dataEstrategiaMarketing && (
                  <p className="text-sm text-gray-500 mt-2">
                    Necesitas completar la Estrategia de Marketing primero.
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
                  <p className="text-blue-700">¡Campaña generada! Guarda para completar el flujo.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navegación entre pasos */}
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