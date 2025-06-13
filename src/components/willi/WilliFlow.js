"use client"
import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, Circle, Loader2, Save, Play } from 'lucide-react';

// Configuración de objetos del flujo
const WORKFLOW_OBJECTS = [
  'estudio-mercado',
  'estrategia-marketing',
  'campania-marketing',
  'contenido'
];

// Componente para mostrar un objeto existente
const ObjectDisplay = ({ objectData, nombreObjeto }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
      <h4 className="text-green-800 font-semibold mb-2">
        ✅ {nombreObjeto.charAt(0).toUpperCase() + nombreObjeto.slice(1)} Cargado
      </h4>
      <div className="bg-white rounded p-3 max-h-40 overflow-y-auto">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {JSON.stringify(objectData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// Hook personalizado para manejar llamadas a la API
const useAPI = () => {
  const [loading, setLoading] = useState(false);

  const apiCall = async (method, endpoint, body = null) => {
    setLoading(true);
    try {
      // Simulación de API call - en un entorno real reemplazar con fetch real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (method === 'GET') {
        // Simular que algunos objetos existen y otros no
        const random = Math.random();
        if (random > 0.5) {
          return {
            success: true,
            data: {
              id: Math.random().toString(36).substr(2, 9),
              nombre: endpoint.split('/')[1],
              descripcion: `Datos existentes para ${endpoint.split('/')[1]}`,
              fechaCreacion: new Date().toISOString(),
              contenido: `Contenido simulado para ${endpoint.split('/')[1]}`
            }
          };
        } else {
          return { success: false, error: 'Objeto no encontrado' };
        }
      } else if (method === 'POST') {
        return {
          success: true,
          data: {
            ...body,
            id: Math.random().toString(36).substr(2, 9),
            fechaCreacion: new Date().toISOString()
          }
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { apiCall, loading };
};

// Componente principal del step
const StepComponent = ({ williObject, nombreObjeto, idProyecto, onComplete }) => {
  const [stepState, setStepState] = useState(williObject);
  const [message, setMessage] = useState('');
  const { apiCall, loading } = useAPI();

  // Resetear estados y cargar objeto cuando cambia el paso
  useEffect(() => {
    // Resetear estado al estado inicial
    setStepState({
      existObject: false,
      objectData: null,
      objectNewData: null,
      generatedObject: false
    });
    setMessage('');
    
    // Cargar objeto existente
    loadExistingObject();
  }, [nombreObjeto, idProyecto]);

  const loadExistingObject = async () => {
    const result = await apiCall('GET', `api/${nombreObjeto}/p=${idProyecto}`);
    
    if (result.success) {
      setStepState(prev => ({
        ...prev,
        existObject: true,
        objectData: result.data
      }));
      setMessage(`${nombreObjeto} cargado exitosamente`);
    } else {
      setMessage(`${nombreObjeto} no existe en el proyecto`);
    }
  };

  const generateWithWilli = async () => {
    setMessage('Generando con Willi...');
    
    // Simulación de generación con IA
    const result = await apiCall('POST', `api/willi/generate`, {
      tipo: nombreObjeto,
      proyecto: idProyecto,
      prompt: `Generar ${nombreObjeto} para el proyecto ${idProyecto}`
    });

    if (result.success) {
      const generatedData = {
        tipo: nombreObjeto,
        contenido: `Contenido generado por Willi para ${nombreObjeto}`,
        descripcion: `Descripción automática generada para ${nombreObjeto}`,
        recomendaciones: [
          `Recomendación 1 para ${nombreObjeto}`,
          `Recomendación 2 para ${nombreObjeto}`,
          `Recomendación 3 para ${nombreObjeto}`
        ],
        generadoPor: 'Willi AI',
        timestamp: new Date().toISOString()
      };

      setStepState(prev => ({
        ...prev,
        objectNewData: generatedData,
        generatedObject: true
      }));
      setMessage(`${nombreObjeto} generado exitosamente con Willi`);
    } else {
      setMessage(`Error al generar ${nombreObjeto}: ${result.error}`);
    }
  };

  const saveObject = async () => {
    const result = await apiCall('POST', `api/${nombreObjeto}/p=${idProyecto}`, stepState.objectNewData);
    
    if (result.success) {
      setStepState(prev => ({
        ...prev,
        existObject: true,
        objectData: result.data,
        objectNewData: null
      }));
      setMessage(`${nombreObjeto} guardado exitosamente`);
    } else {
      setMessage(`Error al guardar ${nombreObjeto}: ${result.error}`);
    }
  };

  const handleNextStep = () => {
    onComplete(stepState);
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800">{message}</p>
        </div>
      )}

      {/* Mostrar objeto existente */}
      {stepState.existObject && stepState.objectData && (
        <ObjectDisplay objectData={stepState.objectData} nombreObjeto={nombreObjeto} />
      )}

      {/* Mostrar mensaje cuando no existe el objeto */}
      {!stepState.existObject && !stepState.objectNewData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            El objeto "{nombreObjeto}" no existe para este proyecto.
          </p>
        </div>
      )}

      {/* Mostrar objeto generado */}
      {stepState.objectNewData && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-purple-800 font-semibold mb-2">
            🤖 {nombreObjeto.charAt(0).toUpperCase() + nombreObjeto.slice(1)} Generado por Willi
          </h4>
          <div className="bg-white rounded p-3 max-h-40 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(stepState.objectNewData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Botones de acción - siempre visibles */}
      <div className="flex gap-3 pt-4">
        {/* Botón Generar/Guardar alternativo */}
        {!stepState.existObject && (
          stepState.objectNewData ? (
            <button
              onClick={saveObject}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar {nombreObjeto}
            </button>
          ) : (
            <button
              onClick={generateWithWilli}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Generar {nombreObjeto} con Willi
            </button>
          )
        )}

        {/* Botón Siguiente Paso - siempre presente */}
        <button
          onClick={handleNextStep}
          disabled={!stepState.existObject}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ml-auto"
        >
          Siguiente Paso
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Componente principal WilliFlow
const WilliFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [idProyecto, setIdProyecto] = useState('');
  const [williObjects, setWilliObjects] = useState({});

  // Obtener ID del proyecto desde searchParams
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id') || 'demo-project-123';
    setIdProyecto(projectId);

    // Inicializar objetos Willi
    const initialObjects = {};
    WORKFLOW_OBJECTS.forEach(objName => {
      initialObjects[objName] = {
        existObject: false,
        objectData: null,
        objectNewData: null,
        generatedObject: false
      };
    });
    setWilliObjects(initialObjects);
  }, []);

  const handleStepComplete = (updatedWilliObject) => {
    const currentObjectName = WORKFLOW_OBJECTS[currentStep];
    setWilliObjects(prev => ({
      ...prev,
      [currentObjectName]: updatedWilliObject
    }));

    // Avanzar al siguiente paso
    if (currentStep < WORKFLOW_OBJECTS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const isStepCompleted = (stepIndex) => {
    const objName = WORKFLOW_OBJECTS[stepIndex];
    return williObjects[objName]?.existObject || false;
  };

  // Crear objeto limpio para el paso actual
  const getCurrentStepObject = () => {
    const currentObjectName = WORKFLOW_OBJECTS[currentStep];
    if (!currentObjectName) return null;
    
    // Siempre retornar un objeto con estado inicial limpio
    return {
      existObject: false,
      objectData: null,
      objectNewData: null,
      generatedObject: false
    };
  };

  if (!idProyecto) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">WilliFlow</h1>
          <p className="text-gray-600">Proyecto ID: {idProyecto}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {WORKFLOW_OBJECTS.map((objName, index) => (
              <div key={objName} className="flex flex-col items-center">
                <button
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isStepCompleted(index)
                      ? 'bg-green-600 text-white'
                      : index === currentStep
                      ? 'bg-blue-600 text-white'
                      : index < currentStep
                      ? 'bg-gray-400 text-white cursor-pointer hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isStepCompleted(index) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <span className={`text-xs text-center max-w-20 ${
                  index === currentStep ? 'text-blue-600 font-semibold' : 'text-gray-600'
                }`}>
                  {objName.charAt(0).toUpperCase() + objName.slice(1)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / WORKFLOW_OBJECTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Paso {currentStep + 1}: {WORKFLOW_OBJECTS[currentStep]?.charAt(0).toUpperCase() + WORKFLOW_OBJECTS[currentStep]?.slice(1)}
          </h2>
          
          {WORKFLOW_OBJECTS[currentStep] && (
            <StepComponent
              key={`${WORKFLOW_OBJECTS[currentStep]}-${currentStep}`} // Key único para forzar re-render
              williObject={getCurrentStepObject()}
              nombreObjeto={WORKFLOW_OBJECTS[currentStep]}
              idProyecto={idProyecto}
              onComplete={handleStepComplete}
            />
          )}
        </div>

        {/* Completion Message */}
        {currentStep >= WORKFLOW_OBJECTS.length - 1 && isStepCompleted(WORKFLOW_OBJECTS.length - 1) && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              ¡Flujo Completado!
            </h3>
            <p className="text-green-700">
              Todos los objetos del proyecto han sido procesados exitosamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WilliFlow;