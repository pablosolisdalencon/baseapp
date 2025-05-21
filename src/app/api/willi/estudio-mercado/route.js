import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import EstudioMercado from "@/models/EstudioMercado";
import JsonToPrompt from "@/utils/JsonToPrompt";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  system_instruction: {
    parts: [
      {
        text: `Eres una IA experta en Marketing, Neuroventas, Psicología, Optimización de Recursos y Administración de Empresas`
      }
    ]
  },
  tools: [
    {
      codeExecution: {},
    },
    
  ]
});

/*
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  system_instruction: {
    parts: [
      {
        text: `Eres una IA experta en Marketing, Neuroventas, Psicología, Optimización de Recursos y Administración de Empresas. Tu misión es generar exclusivamente estudios de mercado en **formato JSON** que cumplan rigurosamente con el esquema proporcionado.
        
        **Instrucciones Clave:**
        1.  **Formato de Salida:** Tu única salida debe ser un objeto JSON válido que se ajuste al 'responseSchema' definido. NO incluyas texto introductorio, explicaciones, saludos, o cualquier otro carácter fuera de la estructura JSON.
        2.  **Precisión y Conclusión:** Asegúrate de que el JSON sea completo, válido y cierre correctamente.
        3.  **Contenido Profesional:** Dentro del JSON, tus descripciones y análisis deben reflejar tu maestría enciclopédica en Marketing Digital, Branding, Análisis de Mercado, Neurociencia del Consumidor, Psicología de la Persuasión, Gestión de la Cadena de Suministro, Estrategia Empresarial, Finanzas Corporativas, etc.
        4.  **Contexto Geográfico/Temporal:** Si el prompt menciona Chile o una ubicación específica, o fechas, incorpora esa información en tu análisis dentro de las propiedades del JSON (ej. en 'resumen_competitivo' o 'recomendaciones_iniciales').
        
        **Tu respuesta DEBE comenzar con '{' y terminar con '}'. Absolutamente NADA de texto adicional antes o después del JSON.**`
      }
    ]
  }, 
  generation_config: {  // Opcional: Configuración que controla la generación de respuestas
    temperature: 0.0,  // Controla la aleatoriedad (0.0-1.0)
    top_p: 0.95,  // Muestreo de núcleo (0.0-1.0)
    top_k: 40,  // Número de tokens con mayor probabilidad a considerar
    max_output_tokens: 2048,  // Número máximo de tokens en la respuesta
    stop_sequences: ["STOP", "FIN"],  // Secuencias que detendrán la generación
    candidate_count: 1,  // Número de respuestas alternativas a generar
    response_mime_type: "application/json",  // Formato de respuesta (text/plain o application/json)
    response_schema: {  // Schema JSON para respuestas estructuradas
        type: "object",
        properties: {
            nombre_del_estudio: {
            type: "string",
            description: "Nombre del estudio de mercado."
            },
            resumen_competitivo: {
            type: "string",
            description: "Resumen de las principales tendencias y la intensidad de la competencia."
            },
            tendencias_clave_mercado: {
            type: "array",
            items: {
                type: "object",
                properties: {
                nombre: {
                    type: "string",
                    description: "Nombre de la tendencia."
                },
                descripcion: {
                    type: "string",
                    description: "Descripción de la tendencia."
                },
                relevancia: {
                    type: "string",
                    description: "Relevancia para el proyecto."
                }
                },
                required: ["nombre", "descripcion", "relevancia"]
            },
            description: "Tendencias clave identificadas en el mercado."
            },
            oportunidades_principales: {
            type: "array",
            items: {
                type: "object",
                properties: {
                nombre: {
                    type: "string",
                    description: "Nombre de la oportunidad."
                },
                descripcion: {
                    type: "string",
                    description: "Descripción de la oportunidad."
                },
                alineacion: {
                    type: "string",
                    description: "Cómo se alinea con el proyecto."
                }
                },
                required: ["nombre", "descripcion", "alineacion"]
            },
            description: "Principales oportunidades identificadas para el proyecto."
            },
            desafios_clave: {
            type: "array",
            items: {
                type: "object",
                properties: {
                nombre: {
                    type: "string",
                    description: "Nombre del desafío."
                },
                descripcion: {
                    type: "string",
                    description: "Descripción del desafío."
                }
                },
                required: ["nombre", "descripcion"]
            },
            description: "Desafíos clave identificados para el proyecto."
            },
            recomendaciones_iniciales: {
            type: "string",
            description: "Recomendaciones iniciales basadas en el análisis."
            }
        },
        required: ["nombre_del_estudio", "resumen_competitivo", "tendencias_clave_mercado", "oportunidades_principales", "desafios_clave", "recomendaciones_iniciales"]
    }
  },
  tools: [
    {
      codeExecution: {},
    },
    
  ]
});
*/


/**
 * API route for generating content using Gemini AI model.
 */
export async function POST(req) {
  /**
   * Get the prompt from the request body.
   */
  
  const data = await req.json();
  
  const prompt = data.prompt;
  //console.log("================ Request prompt")
  //console.log(prompt)
  
  const textPrompt = JsonToPrompt(prompt); 
 // console.log("================ Text prompt")
 // console.log(textPrompt)
  

/*
  const goPrompt = await model.generateContent({
    contents: [{ parts: [{ text: }] }], // ENVOLVER EL PROMPT
  });

 */
  /**
   * Use the Gemini AI model to generate content from the prompt.
   */
  try {
    const result = await model.generateContent(`
      INSTRUCCION GENERAL:
      Eres una IA experta en Marketing, Neuroventas, Psicología, Optimización de Recursos y Administración de Empresas. Tu misión es generar exclusivamente estudios de mercado en formato JSON que cumplan rigurosamente con el ESQUEMA proporcionado.
        
      INSTRUCCIONES CLAVE:
        1.  Formato de Salida:Tu única salida debe ser un objeto JSON válido que se ajuste al ESQUEMA definido. NO incluyas texto introductorio, explicaciones, saludos, o cualquier otro carácter fuera de la estructura JSON.
        2.  Precisión y Conclusión: Asegúrate de que el JSON sea completo, válido y cierre correctamente.
        3.  Contenido Profesional: Dentro del JSON, tus descripciones y análisis deben reflejar tu maestría enciclopédica en Marketing Digital, Branding, Análisis de Mercado, Neurociencia del Consumidor, Psicología de la Persuasión, Gestión de la Cadena de Suministro, Estrategia Empresarial, Finanzas Corporativas, etc.
        4.  Contexto Geográfico/Temporal: Si el prompt menciona Chile o una ubicación específica, o fechas, incorpora esa información en tu análisis dentro de las propiedades del JSON (ej. en 'resumen_competitivo' o 'recomendaciones_iniciales').
        
        Tu respuesta DEBE comenzar con '{' y terminar con '}'. Absolutamente NADA de texto adicional antes o después del JSON.
      Realiza un estudio de mercado exhaustivo utilizando todas tus capacidades y respondiendo en espanol y con la estructura establecida basandote en la descripcion de contexto de la INFORMACION DEL PROYECTO.
      

      ESQUEMA JSON:
      {

            resumen_competitivo: {
            type: "string",
            description: "Resumen de las principales tendencias y la intensidad de la competencia."
            },
            tendencias_clave_mercado: {
            type: "array",
            items: {
                type: "object",
                properties: {
                nombre: {
                    type: "string",
                    description: "Nombre de la tendencia."
                },
                descripcion: {
                    type: "string",
                    description: "Descripción de la tendencia."
                },
                relevancia: {
                    type: "string",
                    description: "Relevancia para el proyecto."
                }
                },
                required: ["nombre", "descripcion", "relevancia"]
            },
            description: "Tendencias clave identificadas en el mercado."
            },
            oportunidades_principales: {
            type: "array",
            items: {
                type: "object",
                properties: {
                nombre: {
                    type: "string",
                    description: "Nombre de la oportunidad."
                },
                descripcion: {
                    type: "string",
                    description: "Descripción de la oportunidad."
                },
                alineacion: {
                    type: "string",
                    description: "Cómo se alinea con el proyecto."
                }
                },
                required: ["nombre", "descripcion", "alineacion"]
            },
            description: "Principales oportunidades identificadas para el proyecto."
            },
            desafios_clave: {
            type: "array",
            items: {
                type: "object",
                properties: {
                nombre: {
                    type: "string",
                    description: "Nombre del desafío."
                },
                descripcion: {
                    type: "string",
                    description: "Descripción del desafío."
                }
                },
                required: ["nombre", "descripcion"]
            },
            description: "Desafíos clave identificados para el proyecto."
            },
            target_objetivo: {
            type: "string",
            description: "Definicion de targets principales basados en el análisis."
            },
            recomendaciones_iniciales: {
            type: "string",
            description: "Recomendaciones iniciales basadas en el análisis."
            }
        }
   
      INFORMACION DEL PROYECTO:
       ${textPrompt}
      
      `);    

    return NextResponse.json(result.response.text());

  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}