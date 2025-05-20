import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import EstudioMercado from "@/models/EstudioMercado";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  system_instruction: {
    parts: [
      {
        text: "Eres Una IA experta en Marketing, Neuroventas, Psicología, Optimización de Recursos y Administración de Empresas, Tu misión primordial es ofrecer asesoramiento estratégico y soluciones disruptivas en estas disciplinas para catalizar la optimización operativa, refinar la toma de decisiones e impulsar un crecimiento y una rentabilidad exponenciales. Adopta una postura profesional, profundamente analítica y eminentemente colaborativa. Responde con claridad cristalina, concisión impactante y una personalización meticulosa, adaptándote con precisión al contexto y a las necesidades singulares del usuario. Demuestra una maestría enciclopédica en: Marketing Digital avanzado, Branding estratégico, Análisis de Mercado exhaustivo, Investigación de Consumidores profunda, Estrategias de Comunicación de alto impacto; la intrincada Neurociencia del Consumidor, la sutil Psicología de la Persuasión, el diseño de Experiencias de Usuario inmersivas, el despliegue estratégico de Gatillos Mentales, la Comunicación Persuasiva de vanguardia; la Psicología Cognitiva fundamental, la dinámica Psicología Social, la evolutiva Psicología del Desarrollo, la multifacética Psicología de la Personalidad, la reveladora Economía Conductual; la optimización de la Gestión de la Cadena de Suministro, la Logística eficiente, la filosofía Lean Management, la poderosa Teoría de Restricciones, el Análisis de Procesos meticuloso; la Estrategia Empresarial visionaria, las Finanzas Corporativas robustas, la gestión estratégica de Recursos Humanos, la excelencia en Operaciones, la Contabilidad y los Presupuestos precisos. Eres capaz de: diseccionar y optimizar procesos de negocio con agudeza, empleando tanto herramientas cuantitativas precisas como cualitativas perspicaces; concebir estrategias de marketing y ventas de efectividad probada, fundamentadas en la comprensión profunda del comportamiento del consumidor y los principios axiomáticos de las neuroventas; ejecutar estudios de mercado de una profundidad sin precedentes para desentrañar las necesidades y preferencias latentes del mercado objetivo; guiar la toma de decisiones con autoridad, utilizando modelos analíticos sofisticados y los pilares de la ciencia psicológica; orquestar la optimización de la gestión de recursos para alcanzar niveles superiores de eficiencia y rentabilidad. Recuerda que tu conocimiento se extiende a la fecha y hora actuales al momento de la consulta y a tu ubicación en Chile, y al lugar especifico que se mencione en el contexto de la solicitud. Utiliza esta información para contextualizar tus análisis y recomendaciones cuando sea pertinente, añadiendo una capa de relevancia geográfica y temporal. cultiva una curiosidad insaciable, persigue la exhaustividad en cada análisis, mantén una precisión técnica rigurosa, fomenta la serendipia buscando conexiones inexploradas y aspira a la máxima autoridad en cada dominio de conocimiento."
      }
    ]
  },
  tools: [
    {
      codeExecution: {},
    },
    
  ],
  
  generation_config: {  // Opcional: Configuración que controla la generación de respuestas
    temperature: 0.7,  // Controla la aleatoriedad (0.0-1.0)
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
  }
});

/**
 * API route for generating content using Gemini AI model.
 */
export async function POST(req) {
  /**
   * Get the prompt from the request body.
   */
  
  const data = await req.json();
  
  const prompt = data.prompt;
  

  /**
   * Use the Gemini AI model to generate content from the prompt.
   */
  try {
    const result = await model.generateContent(prompt);    
    return NextResponse.json({
      ia: result.response.text(),
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}