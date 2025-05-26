import React from 'react'; // Necesario para .tsx
import {
  CampaniaMarketingData,
  DisplayProps,
} from '../types/marketingWorkflowTypes'; // Asegúrate de ajustar la ruta



const CampaniaMarketingDisplay: React.FC<DisplayProps<CampaniaMarketingData>> = ({ Input: CampaniaInput, onSave, showSaveButton = false }) => {
  if (!CampaniaInput) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Campaña de Marketing</h3>
      <div className="bg-gray-50 p-4 rounded-md">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {JSON.stringify(CampaniaInput, null, 2)}
        </pre>
      </div>
      {showSaveButton && onSave && (
        <button
          onClick={() => onSave(CampaniaInput)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Guardar Campaña de Marketing
        </button>
      )}
    </div>
  );
};

export default CampaniaMarketingDisplay