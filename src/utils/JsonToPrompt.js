export default function jsonToPrompt(jsonObject) {
    // Verificamos si la entrada es un objeto válido.
    if (typeof jsonObject !== 'object' || jsonObject === null) {
      console.warn("La entrada no es un objeto JSON válido.");
      return String(jsonObject); // Convertir a string para tipos no objeto
    }
  
    // Usamos Object.entries para obtener un array de [clave, valor]
    // y luego map para formatear cada par como "clave: valor"
    const lines = Object.entries(jsonObject).map(([key, value]) => {
      // Manejar casos donde el valor sea un objeto o un array anidado
      if (typeof value === 'object' && value !== null) {
        // Si el valor es un objeto o array, podrías recursivamente llamarlo
        // o simplemente convertirlo a su representación JSON stringificada.
        // Para este ejemplo, lo stringificamos para mantenerlo en una línea.
        return `${key}: ${JSON.stringify(value)}`;
      }
      return `${key}: ${value}`;
    });
  
    // Unimos todas las líneas con un salto de línea
    return lines.join(`
      `).replace(/"/g, '').replace(/{/g, `
      `).replace(/}/g, `
      `).replace(/.,/g, `
      `).replace(/],/g, `
      `);
  }