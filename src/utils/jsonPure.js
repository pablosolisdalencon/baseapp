export default function jsonPure(responseData) {
  let processedData;

  // Determinar el tipo y convertir a string si es necesario
  if (typeof responseData === 'string') {
    processedData = responseData;
  } else if (typeof responseData === 'object') {
    // Si es objeto, convertir a JSON string
    processedData = JSON.stringify(responseData);
  } else if (typeof responseData === 'number' || typeof responseData === 'boolean') {
    // Si es número o boolean, convertir a string
    processedData = String(responseData);
  } else {
    // Para cualquier otro tipo, intentar convertir a string
    processedData = String(responseData);
  }

  // Limpiar formato markdown si existe
  if (processedData.trim().startsWith('```json')) {
    // Eliminar ```json del inicio
    processedData = processedData.replace(/^```json\s*/i, '');
    // Eliminar ``` del final
    processedData = processedData.replace(/\s*```$/, '');
  } else if (processedData.trim().startsWith('```')) {
    // Eliminar ``` genérico del inicio
    processedData = processedData.replace(/^```\s*/, '');
    // Eliminar ``` del final
    processedData = processedData.replace(/\s*```$/, '');
  }

  // Limpiar espacios en blanco al inicio y final
  processedData = processedData.trim();

  // Verificar si es un array y extraer el primer elemento
  if (processedData.startsWith('[')) {
    try {
      const parsedArray = JSON.parse(processedData);
      if (Array.isArray(parsedArray) && parsedArray.length > 0) {
        // Tomar el primer elemento del array
        const firstElement = parsedArray[0];
        // Convertir el primer elemento a JSON string
        processedData = JSON.stringify(firstElement);
      }
    } catch (error) {
      console.warn('Error al procesar array, manteniendo string original:', error);
    }
  }

  // Verificar que sea un objeto JSON válido (debe empezar con {)
  if (!processedData.startsWith('{')) {
    throw new Error('Los datos procesados no representan un objeto JSON válido');
  }

  return processedData;
}