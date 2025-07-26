'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GWV from '@/utils/GWV';
import { useSession } from 'next-auth/react';
import {
  EstudioMercadoData,
  EstrategiaMarketingData,
  CampaniaMarketingData,
  WorkflowStep,
} from '../../types/marketingWorkflowTypes';
import EstudioMercadoDisplay from './../EstudioMercadoDisplay';
import EstrategiaMarketingDisplay from './../EstrategiaMarketingDisplay';
import CampaniaMarketingDisplay from './../CampaniaMarketingDisplay';

const STEPS = [
  {
    number: 1,
    title: 'Estudio de Mercado',
    item: 'estudio-mercado',
    action: 'generate-estudio',
    component: EstudioMercadoDisplay,
    propKey: 'estudio',
  },
  {
    number: 2,
    title: 'Estrategia de Marketing',
    item: 'estrategia-marketing',
    action: 'generate-estrategia',
    component: EstrategiaMarketingDisplay,
    propKey: 'estrategia',
  },
  {
    number: 3,
    title: 'Campaña de Marketing',
    item: 'campania-marketing',
    action: 'generate-campania',
    component: CampaniaMarketingDisplay,
    propKey: 'campania',
  },
];

interface MarketingWorkflowProps {
  initialEstudio: EstudioMercadoData | null;
  initialEstrategia: EstrategiaMarketingData | null
  initialCampania: CampaniaMarketingData | null;
  idProyectoD: string | null;
}

const MarketingWorkflow: React.FC<MarketingWorkflowProps> = ({ idProyectoD, initialEstudio, initialEstrategia, initialCampania }) => {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idProyecto] = useState(idProyectoD);

  const [prices, setPrices] = useState({
    'generate-estudio': null,
    'generate-estrategia': null,
    'generate-campania': null,
  });

  const [workflowData, setWorkflowData] = useState({
    estudio: initialEstudio,
    estrategia: initialEstrategia,
    campania: initialCampania,
  });

  const [savedStatus, setSavedStatus] = useState({
    estudio: !!initialEstudio,
    estrategia: !!initialEstrategia,
    campania: !!initialCampania,
  });

  const getPrice = useCallback(async (action: string) => {
    try {
      const res = await fetch(`/api/pricing?a=${action}`);
      if (!res.ok) return null;
      const { price } = await res.json();
      return price;
    } catch {
      return null;
    }
  }, []);

  const validarSaldo = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/user-tokens?e=${email}`);
      if (!res.ok) return null;
      const { tokens } = await res.json();
      return tokens;
    } catch {
      return null;
    }
  }, []);

  const descontarTokens = useCallback(async (monto: number, email: string) => {
    try {
      const res = await fetch(`/api/user-tokens`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens: monto, email }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  const ejecutarAccion = async (objectAction: any) => {
    const { mode, projectId, item, estudio, estrategia } = objectAction;
    try {
      const result = await GWV(mode, projectId, item, estudio, estrategia);
      return result[0];
    } catch (e) {
      return { generated: { texto: `Error: ${e}` } };
    }
  };

  const useTokens = useCallback(async (action: string, objectAction: any) => {
    const currentUserEmail = session?.user?.email;
    if (!currentUserEmail) return { generated: { texto: 'Error: No se encontró el usuario.' } };

    const saldoActual = await validarSaldo(currentUserEmail);
    const price = prices[action as keyof typeof prices];

    if (saldoActual === null || price === null) return { generated: { texto: 'Error: No se pudo validar saldo o precio.' } };
    if (saldoActual < price) return { generated: { texto: 'Saldo Insuficiente.' } };

    const saldoDespuesDelDescuento = saldoActual - price;
    const descuentoExitoso = await descontarTokens(saldoDespuesDelDescuento, currentUserEmail);

    if (descuentoExitoso) {
      const resultadoAccion = await ejecutarAccion(objectAction);
      if (resultadoAccion?.generated?.texto?.startsWith('Error:')) {
        await descontarTokens(saldoActual, currentUserEmail);
        return { generated: { texto: 'Fallo en la generación. Tus tokens han sido restaurados.' } };
      }
      return resultadoAccion;
    }
    return { generated: { texto: 'Error al descontar tokens.' } };
  }, [session, prices, validarSaldo, descontarTokens]);

  const saveGenData = useCallback(async () => {
    setIsLoading(true);
    try {
      const step = STEPS.find(s => s.number === currentStep);
      if (!step) return;

      const bodyData = workflowData[step.propKey as keyof typeof workflowData];
      const res = await fetch(`/api/${step.item}?p=${idProyecto}`, {
        method: 'POST',
        body: JSON.stringify(bodyData),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(`Oops! No se ha guardado ${step.item}`);

      setSavedStatus(prev => ({ ...prev, [step.propKey]: true }));
      setCurrentStep(prev => prev + 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [idProyecto, workflowData, currentStep]);

  const handleGenerate = useCallback(async (step: typeof STEPS[0]) => {
    setIsLoading(true);
    setError(null);
    try {
      const itemObject = {
        mode: 'generate',
        projectId: idProyecto,
        item: step.item,
        estudio: workflowData.estudio,
        estrategia: workflowData.estrategia,
      };

      const result = await useTokens(step.action, itemObject);
      if (result?.generated?.texto?.startsWith('Error:')) throw new Error(result.generated.texto);

      setWorkflowData(prev => ({ ...prev, [step.propKey]: result.generated }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [useTokens, idProyecto, workflowData]);

  useEffect(() => {
    const fetchPrices = async () => {
      const [pEstudio, pEstrategia, pCampania] = await Promise.all([
        getPrice('generate-estudio'),
        getPrice('generate-estrategia'),
        getPrice('generate-campania'),
      ]);
      setPrices({
        'generate-estudio': pEstudio,
        'generate-estrategia': pEstrategia,
        'generate-campania': pCampania,
      });
    };
    fetchPrices();
  }, [getPrice]);

  const currentStepObj = useMemo(() => STEPS.find(step => step.number === currentStep), [currentStep]);
  const isLastStep = useMemo(() => currentStep === STEPS.length, [currentStep]);
  
  const isCurrentStepSaved = useMemo(() => savedStatus[currentStepObj?.propKey as keyof typeof savedStatus] ?? false, [savedStatus, currentStepObj]);
  const isCurrentStepGenerated = useMemo(() => !!workflowData[currentStepObj?.propKey as keyof typeof workflowData], [workflowData, currentStepObj]);

  const hasDependencyResolved = useMemo(() => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return savedStatus.estudio;
    if (currentStep === 3) return savedStatus.estrategia;
    return false;
  }, [currentStep, savedStatus]);

  const renderContent = () => {
    if (!currentStepObj) return null;
    const DisplayComponent = currentStepObj.component;
    const data = workflowData[currentStepObj.propKey as keyof typeof workflowData];

    if (isLoading) return null;

    if (isCurrentStepSaved) {
      return (
        <>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <p className="text-green-700">{currentStepObj.title} existente encontrado</p>
          </div>
          <DisplayComponent Input={data} />
          {!isLastStep && (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continuar al Paso {currentStep + 1}
            </button>
          )}
        </>
      );
    }

    if (isCurrentStepGenerated) {
      return (
        <DisplayComponent
          Input={data}
          onSave={saveGenData}
          showSaveButton={true}
        />
      );
    }

    return (
      <>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-yellow-700">No se encontró {currentStepObj.title} existente</p>
        </div>
        <button
          onClick={() => handleGenerate(currentStepObj)}
          disabled={!hasDependencyResolved}
          className={`px-6 py-2 rounded-md transition-colors ${!hasDependencyResolved ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          Generar {currentStepObj.title} {prices[currentStepObj.action as keyof typeof prices] || '...'}
        </button>
        {!hasDependencyResolved && (
          <p className="text-sm text-gray-500 mt-2">
            Necesitas completar el paso anterior primero
          </p>
        )}
      </>
    );
  };

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
          {STEPS.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${step.number === currentStep ? 'bg-blue-600 ring-4 ring-blue-200' : (savedStatus[step.propKey as keyof typeof savedStatus] || step.number < currentStep) ? 'bg-green-600' : 'bg-gray-300'}`}>
                  {(savedStatus[step.propKey as keyof typeof savedStatus] || step.number < currentStep) ? '✓' : step.number}
                </div>
                <span className={`text-sm mt-2 text-center ${step.number === currentStep ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mt-4 mx-2 ${(savedStatus[step.propKey as keyof typeof savedStatus] || step.number < currentStep) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
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
            <img className="flow-img" src={`/step${currentStep}.png`} />
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Procesando...</span>
          </div>
        )}
        {!isLoading && renderContent()}
        {currentStep > STEPS.length && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
            <p className="text-blue-700">¡Felicitaciones Flujo de Marketing finalizado con exito!</p>
          </div>
        )}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1 || isLoading}
            className={`px-4 py-2 rounded-md transition-colors ${currentStep === 1 || isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
          >
            Paso Anterior
          </button>
          <button
            onClick={() => setCurrentStep(prev => Math.min(STEPS.length + 1, prev + 1))}
            disabled={isLastStep || isLoading}
            className={`px-4 py-2 rounded-md transition-colors ${isLastStep || isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Siguiente Paso
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketingWorkflow;