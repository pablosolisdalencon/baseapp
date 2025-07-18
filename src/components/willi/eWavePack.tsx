// src/app/ewave-maker/_components/WilliEwavePackGenerator.tsx
'use client';

import React, { useState, useTransition, useEffect } from 'react';
import {
  MakerData,
  EstudioMercadoData,
  EstrategiaMarketingData,
  CampaniaMarketingData,
  GeneratedPost,
  GenerationStatus,
  WorkflowStep,
  Post,WilliEwavePackGeneratorProps
} from '@/types/marketingWorkflowTypes';

import DisplayMakerData from '../DisplayMakerData';
import EstudioMercadoDisplay from '../EstudioMercadoDisplay';
import EstrategiaMarketingDisplay from '../EstrategiaMarketingDisplay';
import CampaniaMarketingDisplay from '../CampaniaMarketingDisplay';
import GeneratedPostCard from '../GeneratedPostCard';

import {
  generateEwavePack,
  saveObjectToDB,
  optimizeObjectWithWilli,
  retryGeneratePost  
} from '../ewavepack/actions'; // Importa las Server Actions



const workflowSteps: WorkflowStep[] = [
  { key: 'idle', title: 'Listo para Generar', description: 'Haz clic para iniciar el proceso de creación del eWavePack.' },
  { key: 'generating_maker_data', title: 'Generando Ficha del Proyecto (MakerData)', description: 'Recopilando la información clave de tu proyecto y catálogo.' },
  { key: 'generating_estudio', title: 'Generando Estudio de Mercado', description: 'Willi está analizando tendencias, oportunidades y desafíos del mercado.' },
  { key: 'generating_estrategia', title: 'Generando Estrategia de Marketing', description: 'Willi está diseñando los objetivos, pilares y tácticas iniciales para tu campaña.' },
  { key: 'generating_campania', title: 'Generando Campaña de Marketing', description: 'Willi está creando el plan de contenido detallado por semanas y días.' },
  { key: 'generating_posts', title: 'Generando Contenido para Posts', description: 'Willi está creando el texto y la imagen para cada publicación de tu campaña.' },
  { key: 'complete', title: 'eWavePack Completo', description: '¡Tu eWavePack ha sido generado exitosamente!' },
  { key: 'error', title: 'Error en la Generación', description: 'Ocurrió un problema durante el proceso. Por favor, revisa o inténtalo de nuevo.' },
];

const WilliEwavePackGenerator: React.FC<WilliEwavePackGeneratorProps> = ({ idProyecto }) => {
  const [currentStatus, setCurrentStatus] = useState<GenerationStatus>('idle');
  const [makerData, setMakerData] = useState<MakerData | null>(null);
  const [estudioMercado, setEstudioMercado] = useState<EstudioMercadoData | null>(null);
  const [estrategiaMarketing, setEstrategiaMarketing] = useState<EstrategiaMarketingData | null>(null);
  const [campaniaMarketing, setCampaniaMarketing] = useState<CampaniaMarketingData | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerateEwavePack = async () => {
    if (!idProyecto) {
      setGenerationError("ID de Proyecto no proporcionado.");
      setCurrentStatus('error');
      return;
    }

    setCurrentStatus('generating_maker_data');
    setGenerationError(null);
    setMakerData(null);
    setEstudioMercado(null);
    setEstrategiaMarketing(null);
    setCampaniaMarketing(null);
    setGeneratedPosts([]);

    startTransition(async () => {
      try {
        const result = await generateEwavePack(idProyecto);

        if (result.error) {
          setGenerationError(result.error);
          setCurrentStatus('error');
          return;
        }

        // Actualización progresiva de la UI
        if (result.makerData) { setMakerData(result.makerData); setCurrentStatus('generating_estudio'); }
        // Pequeño delay para visibilidad del progreso
        await new Promise(resolve => setTimeout(resolve, 500));

        if (result.estudioMercado) { setEstudioMercado(result.estudioMercado); setCurrentStatus('generating_estrategia'); }
        await new Promise(resolve => setTimeout(resolve, 500));

        if (result.estrategiaMarketing) { setEstrategiaMarketing(result.estrategiaMarketing); setCurrentStatus('generating_campania'); }
        await new Promise(resolve => setTimeout(resolve, 500));

        if (result.campaniaMarketing) { setCampaniaMarketing(result.campaniaMarketing); setCurrentStatus('generating_posts'); }
        await new Promise(resolve => setTimeout(resolve, 500));

        // Para los posts, se asume que generateEwavePack ya los retorna listos.
        // Si quisieras un progreso post-a-post, tendrías que modificar la Server Action
        // para emitir updates o hacer llamadas separadas y usar estado loading en cada GeneratedPostCard.
        if (result.generatedPosts) { setGeneratedPosts(result.generatedPosts); }

        setCurrentStatus('complete');
      } catch (err: any) {
        setGenerationError(err.message || "Error inesperado al generar el eWavePack.");
        setCurrentStatus('error');
      }
    });
  };

  const currentStep = workflowSteps.find(step => step.key === currentStatus) || workflowSteps[0];
  const isGenerating = isPending || (currentStatus !== 'idle' && currentStatus !== 'complete' && currentStatus !== 'error');

  const handleSave = async (data: any, type: string) => {
    if (!idProyecto) { alert("ID de Proyecto no disponible para guardar."); return; }
    const result = await saveObjectToDB(idProyecto, type, data);
    if (result.success) { alert(`${type} guardado exitosamente!`); } else { alert(`Error al guardar ${type}: ${result.error}`); }
  };

  const handleOptimize = async (data: any, type: string) => {
    if (!idProyecto) { alert("ID de Proyecto no disponible para optimizar."); return; }
    alert(`Solicitando optimización de ${type} con Willi...`);
    const result = await optimizeObjectWithWilli(idProyecto, type, data);
    if (result.success) { alert(`${type} optimizado exitosamente!`); /* Podrías actualizar el estado con result.optimizedData */ } else { alert(`Error al optimizar ${type}: ${result.error}`); }
  };

  const handleRetryPost = async (postToRetry: GeneratedPost) => {
    if (!idProyecto) { alert("ID de Proyecto no disponible para reintentar."); return; }
    // Encuentra el índice del post a reintentar
    const index = generatedPosts.findIndex(p => p.id === postToRetry.id);
    if (index === -1) return;

    // Actualiza el estado para mostrar que se está cargando solo este post
    const updatedPosts = [...generatedPosts];
    updatedPosts[index] = { ...updatedPosts[index], text: 'Generando nuevo texto...', image: null }; // O un spinner temporal
    setGeneratedPosts(updatedPosts);

    // Llama a la Server Action para reintentar
    const result = await retryGeneratePost(idProyecto, postToRetry.originalPostData);
    if (result.success && result.generatedPost) {
      updatedPosts[index] = result.generatedPost; // Reemplaza el post con el nuevo
      setGeneratedPosts(updatedPosts);
      alert("Post reintentado y generado exitosamente!");
    } else {
      updatedPosts[index] = { ...postToRetry, text: `Error: ${result.error || 'Fallo al reintentar.'}` };
      setGeneratedPosts(updatedPosts);
      alert(`Error al reintentar post: ${result.error}`);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-8 mt-4">
        eWavePack Maker
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Willi, Crea el eWavePack de {idProyecto ? `"${idProyecto}"` : "tu Proyecto !"}
        </h2>
        <button
          onClick={handleGenerateEwavePack}
          disabled={isGenerating}
          className={`px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 ${
            isGenerating
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed animate-pulse'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {currentStep.title}...
            </span>
          ) : (
            'Willi, Crea el eWavePack !'
          )}
        </button>
        <p className="mt-4 text-gray-600 italic">{currentStep.description}</p>
        {generationError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p>Error: {generationError}</p>
          </div>
        )}
      </div>

      {makerData && (
        <div className="mt-8 fade-in">
          <DisplayMakerData Input={makerData} onSave={(data) => handleSave(data, 'MakerData')} showSaveButton={true} />
        </div>
      )}

      {estudioMercado && (
        <div className="mt-8 fade-in">
          <EstudioMercadoDisplay
            Input={estudioMercado}
            onSave={(data) => handleSave(data, 'EstudioMercado')}
            onOptimize={(data) => handleOptimize(data, 'EstudioMercado')}
            onRetry={(data) => handleGenerateEwavePack()} // Reintentar todo el flujo desde el inicio
            showSaveButton={true}
            showOptimizeButton={true}
            showRetryButton={false} // No tiene sentido reintentar un estudio solo
          />
        </div>
      )}

      {estrategiaMarketing && (
        <div className="mt-8 fade-in">
          <EstrategiaMarketingDisplay
            Input={estrategiaMarketing}
            onSave={(data) => handleSave(data, 'EstrategiaMarketing')}
            onOptimize={(data) => handleOptimize(data, 'EstrategiaMarketing')}
            onRetry={(data) => handleGenerateEwavePack()} // Reintentar todo el flujo
            showSaveButton={true}
            showOptimizeButton={true}
            showRetryButton={false}
          />
        </div>
      )}

      {campaniaMarketing && (
        <div className="mt-8 fade-in">
          <CampaniaMarketingDisplay
            Input={campaniaMarketing}
            onSave={(data) => handleSave(data, 'CampaniaMarketing')}
            onOptimize={(data) => handleOptimize(data, 'CampaniaMarketing')}
            onRetry={(data) => handleGenerateEwavePack()} // Reintentar todo el flujo
            showSaveButton={true}
            showOptimizeButton={true}
            showRetryButton={false}
          />
        </div>
      )}

      {generatedPosts.length > 0 && (
        <div className="mt-8 fade-in">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 border-b pb-4">
            🚀 Posts de la Campaña
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedPosts.map((post) => (
              <GeneratedPostCard
                key={post.id}
                post={post}
                onSave={(data) => handleSave(data, 'GeneratedPost')}
                onOptimize={(data) => handleOptimize(data, 'GeneratedPost')}
                onRetry={handleRetryPost} // Llama a la función específica para reintentar un post
                showSaveButton={true}
                showOptimizeButton={true}
                showRetryButton={true}
                isRetryDisabled={isPending} // Deshabilita reintentar si ya hay una generación en curso
                isLoading={isPending && generatedPosts.some(p => p.id === post.id && p.text === 'Generando nuevo texto...')} // Puedes refinar esto
              />
            ))}
          </div>
        </div>
      )}

      {(currentStatus === 'complete' || currentStatus === 'error') && (
        <div className="mt-12 p-8 bg-indigo-100 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">
            Proceso Finalizado
          </h2>
          {currentStatus === 'complete' ? (
            <>
              <p className="text-gray-700 mb-6">
                Tu eWavePack ha sido generado y está listo para ser explorado:
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href={`/mktviewer?id=${idProyecto}`} // Ajusta tus rutas
                  className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver Estudio, Estrategia y Campaña
                </a>
                <a
                  href={`/contents-manager?id=${idProyecto}`} // Ajusta tus rutas
                  className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gestionar Contenidos (Posts)
                </a>
              </div>
            </>
          ) : (
            <p className="text-red-700">
              Hubo un problema. Por favor, revisa el mensaje de error o intenta nuevamente.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WilliEwavePackGenerator;