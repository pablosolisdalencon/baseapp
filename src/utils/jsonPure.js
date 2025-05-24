function normalizarParaJSONParse(MiEstudio) {
    // Si es null o undefined, convertir a string JSON válido
    if (MiEstudio === null || MiEstudio === undefined) {
        return 'null';
    }
    
    // Si es un string vacío, convertir a null JSON
    if (MiEstudio === '') {
        return 'null';
    }
    
    // Si ya es un string, verificar si es JSON válido
    if (typeof MiEstudio === 'string') {
        try {
            // Intentar parsear para validar si es JSON válido
            JSON.parse(MiEstudio);
            return MiEstudio; // Ya es un string JSON válido
        } catch (error) {
            // No es JSON válido, convertir el string a JSON
            return JSON.stringify(MiEstudio);
        }
    }
    
    // Si es un objeto, array, número, boolean, convertir a string JSON
    return JSON.stringify(MiEstudio);
}

// Función principal que siempre permite usar JSON.parse()
export default function jsonPure(MiEstudio) {
    const estudloNormalizado = normalizarParaJSONParse(MiEstudio);

    return estudloNormalizado;
    //return JSON.parse(estudloNormalizado);
}
/*
// Ejemplos de uso:

// Caso 1: Variable es null
let MiEstudio1 = null;
console.log('Caso null:', procesarMiEstudio(MiEstudio1));

// Caso 2: Variable es undefined
let MiEstudio2;
console.log('Caso undefined:', procesarMiEstudio(MiEstudio2));

// Caso 3: Variable es string vacío
let MiEstudio3 = '';
console.log('Caso string vacío:', procesarMiEstudio(MiEstudio3));

// Caso 4: Variable es un objeto
let MiEstudio4 = { nombre: 'Juan', edad: 30 };
console.log('Caso objeto:', procesarMiEstudio(MiEstudio4));

// Caso 5: Variable es un array
let MiEstudio5 = [1, 2, 3, 'texto'];
console.log('Caso array:', procesarMiEstudio(MiEstudio5));

// Caso 6: Variable es un string JSON válido
let MiEstudio6 = '{"ciudad": "Madrid", "población": 3000000}';
console.log('Caso JSON string:', procesarMiEstudio(MiEstudio6));

// Caso 7: Variable es un string normal (no JSON)
let MiEstudio7 = 'Hola mundo';
console.log('Caso string normal:', procesarMiEstudio(MiEstudio7));

// Caso 8: Variable es un número
let MiEstudio8 = 42;
console.log('Caso número:', procesarMiEstudio(MiEstudio8));

// Caso 9: Variable es boolean
let MiEstudio9 = true;
console.log('Caso boolean:', procesarMiEstudio(MiEstudio9));

// Caso 10: Array vacío
let MiEstudio10 = [];
console.log('Caso array vacío:', procesarMiEstudio(MiEstudio10));

// Caso 11: Objeto vacío
let MiEstudio11 = {};
console.log('Caso objeto vacío:', procesarMiEstudio(MiEstudio11));

// Versión más compacta si prefieres una sola función:
function jsonPure(MiEstudio) {
    if (MiEstudio === null || MiEstudio === undefined || MiEstudio === '') {
        return JSON.parse('null');
    }
    
    if (typeof MiEstudio === 'string') {
        try {
            return JSON.parse(MiEstudio);
        } catch {
            return JSON.parse(JSON.stringify(MiEstudio));
        }
    }
    
    return JSON.parse(JSON.stringify(MiEstudio));
}*/