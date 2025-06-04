'use client';

import { useState, useEffect } from 'react';
import React from 'react'; // Necesario para .tsx
import {
  MakerData,
  EstudioMercadoData,
  EstrategiaMarketingData,
  CampaniaMarketingData,
  WilliAPIResponse,
  WorkflowStep,
} from '../types/marketingWorkflowTypes'; // Asegúrate de ajustar la ruta

import EstudioMercadoDisplay from './EstudioMercadoDisplay';
import EstrategiaMarketingDisplay from './EstrategiaMarketingDisplay';
import CampaniaMarketingDisplay from './CampaniaMarketingDisplay';

// --- Componente principal del Flujo de Marketing ---
interface MarketingWorkflowProps {
  idProyecto?: string;
}

const MarketingWorkflow: React.FC<MarketingWorkflowProps> = ({ idProyecto = "proyecto-123" }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para los datos, ahora tipados con 'null' o el tipo de interfaz
  const [dataMaker, setDataMaker] = useState<MakerData | null>(null);
  const [dataEstudioMercado, setDataEstudioMercado] = useState<EstudioMercadoData | null>(null);
  const [dataEstrategiaMarketing, setDataEstrategiaMarketing] = useState<EstrategiaMarketingData | null>(null);
  const [dataCampaniaMarketing, setDataCampaniaMarketing] = useState<CampaniaMarketingData | null>(null);

  // Estados para controlar la existencia en BD (boolean o null inicial)
  const [existeEstudio, setExisteEstudio] = useState<boolean | null>(null);
  const [existeEstrategia, setExisteEstrategia] = useState<boolean | null>(null);
  const [existeCampania, setExisteCampania] = useState<boolean | null>(null);

  // Simulación de APIs (ahora tipadas)


  //////  CHECK ESTUDIO MERCADO EXIST
  const checkEstudioMercadoExists = async (projectId: string): Promise<EstudioMercadoData | null> => {
    try {
      // Aquí, reemplaza '/api/estudios-mercado/check' con la URL real de tu endpoint de backend
      // que verifica la existencia del estudio de mercado.
      // Podrías pasar el projectId como query parameter o en el body,
      // pero como query parameter es común para GET requests.
      const response = await fetch(`/api/estudio-mercado?p=${projectId}`, {
        method: 'GET', // Usar GET para consultas de existencia
        headers: {
          'Content-Type': 'application/json',
          // Si necesitas autenticación, añade aquí tu token, por ejemplo:
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });
  
      if (response.ok) {
        // Si la respuesta es 200 OK, asumimos que el estudio fue encontrado.
        // La API debería devolver los datos del estudio directamente.
        const data: EstudioMercadoData = await response.json();
        return data;
      } else if (response.status === 404) {
        // Si la API devuelve 404 Not Found, significa que no existe el estudio para ese proyecto.
        return null;
      } else {
        // Manejo de otros posibles errores de la API
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al verificar estudio de mercado: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      console.error("Fallo al verificar existencia del estudio de mercado:", error);
      // Relanza el error para que el componente lo maneje en el estado `error`
      throw new Error(`No se pudo verificar el estudio de mercado: ${error.message}`);
    }
  };





  //////// CHECK ESTRATEGIA EXIST
  const checkEstrategiaMarketingExists = async (projectId: string): Promise<EstrategiaMarketingData | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.5 ? null : {
      id: "estrategia-123",
      id_proyecto: projectId,
      objetivos: "Objetivos estratégicos existentes (simulados)...",
      tacticas: "Tácticas de marketing existentes (simuladas)...",
      fecha: new Date().toISOString()
    };
  };






  //////// CHECK CAMAPANIA EXIST

  const checkCampaniaMarketingExists = async (projectId: string): Promise<CampaniaMarketingData | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.5 ? null : {
      id: "campania-123",
      id_proyecto: projectId,
      nombre: "Campaña de Lanzamiento Existente",
      canales: "Redes sociales, Email, SEM (existente)",
      presupuesto: "$10,000 (existente)",
      fecha: new Date().toISOString()
    };
  };

  const getMakerData = async (projectId: string): Promise<MakerData> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      id_proyecto: projectId,
      producto: "Aplicación móvil de fintech",
      mercadoObjetivo: "Millennials y Gen Z",
      propuestaValor: "Gestión financiera simplificada",
      fecha: new Date().toISOString()
    };
  };

  // callWilliAPI ahora devuelve un tipo genérico de WilliAPIResponse
  const callWilliAPI = async (bodyData: { maker?: MakerData | null; estudio?: EstudioMercadoData | null; estrategia?: EstrategiaMarketingData | null }): Promise<WilliAPIResponse> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (bodyData.maker && !bodyData.estudio && !bodyData.estrategia) {
      // Generar Estudio de Mercado
      return {nombre_del_estudio: "ESTUDIO EMULADO CREADO" } as EstudioMercadoData; // Casteo explícito
    } else if (bodyData.estudio && !bodyData.estrategia) {
      // Generar Estrategia de Marketing
      return {
        tipo: "estrategia-marketing",
        objetivosPrincipales: "Aumentar awareness en 40% en 6 meses (generado)...",
        publicoObjetivo: "Definición detallada del público objetivo (generado)...",
        propuestaValor: "Posicionamiento único en el mercado (generado)...",
        canalesdistribucion: "Digital-first con presencia física selectiva (generado)...",
        metricas: "KPIs específicos para medir éxito (generado)...",
        generadoPor: "Willi AI",
        fecha: new Date().toISOString()
      } as EstrategiaMarketingData; // Casteo explícito
    } else if (bodyData.estrategia) {
      // Generar Campaña de Marketing
      return {
        tipo: "campania-marketing",
        nombreCampania: "Lanzamiento Disruptivo 2024 (generado)",
        fasesEjecucion: "Pre-lanzamiento, Lanzamiento, Post-lanzamiento (generado)...",
        creatividad: "Conceptos creativos y mensajes clave (generado)...",
        presupuestoDetalle: "Distribución de $50,000 en 6 meses (generado)...",
        cronograma: "Timeline detallado de 26 semanas (generado)...",
        generadoPor: "Willi AI",
        fecha: new Date().toISOString()
      } as CampaniaMarketingData; // Casteo explícito
    }
    throw new Error("Solicitud inválida para Willi API"); // Manejar caso por defecto
  };

  const saveEstudioMercado = async (data: EstudioMercadoData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Guardando estudio de mercado:", data);
    alert("Estudio de Mercado guardado exitosamente");
    setExisteEstudio(true); // Marca como existente en BD tras guardar
    setCurrentStep(2);
  };

  const saveEstrategiaMarketing = async (data: EstrategiaMarketingData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Guardando estrategia de marketing:", data);
    alert("Estrategia de Marketing guardada exitosamente");
    setExisteEstrategia(true); // Marca como existente en BD tras guardar
    setCurrentStep(3);
  };

  const saveCampaniaMarketing = async (data: CampaniaMarketingData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Guardando campaña de marketing:", data);
    alert("Campaña de Marketing guardada exitosamente");
    setExisteCampania(true); // Marca como existente en BD tras guardar
  };

  // Efecto para verificar existencia de datos cuando cambia el paso
  useEffect(() => {
    const checkExistence = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (currentStep === 1) {
          const estudioExistente = await checkEstudioMercadoExists(idProyecto);
          setExisteEstudio(!!estudioExistente);
          if (estudioExistente) {
            setDataEstudioMercado(estudioExistente);
          }
        } else if (currentStep === 2) {
          const estrategiaExistente = await checkEstrategiaMarketingExists(idProyecto);
          setExisteEstrategia(!!estrategiaExistente);
          if (estrategiaExistente) {
            setDataEstrategiaMarketing(estrategiaExistente);
          }
        } else if (currentStep === 3) {
          const campaniaExistente = await checkCampaniaMarketingExists(idProyecto);
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

  const handleGenerateEstudio = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const makerData = await getMakerData(idProyecto);
      setDataMaker(makerData);

      const estudioData = await callWilliAPI({ maker: makerData });
      // Aquí puedes añadir validación para asegurarte de que el tipo sea correcto
      setDataEstudioMercado(estudioData as EstudioMercadoData);
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
      const estrategiaData = await callWilliAPI({
        maker: dataMaker,
        estudio: dataEstudioMercado
      });
      setDataEstrategiaMarketing(estrategiaData as EstrategiaMarketingData);
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
      const campaniaData = await callWilliAPI({
        maker: dataMaker,
        estudio: dataEstudioMercado,
        estrategia: dataEstrategiaMarketing
      });
      setDataCampaniaMarketing(campaniaData as CampaniaMarketingData);
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
                  <p className="text-yellow-700">No se encontró estudio de mercado existente</p>
                </div>
                <button
                  onClick={handleGenerateEstudio}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Generar Estudio de Mercado
                </button>
              </div>
            )}

            {dataEstudioMercado && existeEstudio === false && (
              <EstudioMercadoDisplay
                Input={dataEstudioMercado}
                onSave={saveEstudioMercado}
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
                  Generar Estrategia de Marketing
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
                onSave={saveEstrategiaMarketing}
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
                  Generar Campaña de Marketing
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
                  onSave={saveCampaniaMarketing}
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