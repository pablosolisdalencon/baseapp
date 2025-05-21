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

export async function POST(req) {

  const data = await req.json();
  const promptMaker = data.maker;
  const promptEstudioMercado = data.estudio_mercado;

  const textMaker = JsonToPrompt(promptMaker); 
  const textEstudioMercado = JsonToPrompt(promptEstudioMercado); 
 
  try {
    const result = await model.generateContent(`
      INSTRUCCION GENERAL:
      Eres una IA experta en Marketing, Neuroventas, Psicología, Optimización de Recursos y Administración de Empresas. Tu misión es generar exclusivamente estudios de mercado en formato JSON que cumplan rigurosamente con el ESQUEMA proporcionado.
        
      INSTRUCCIONES CLAVE:
        1.  Formato de Salida:Tu única salida debe ser un objeto JSON válido que se ajuste al ESQUEMA definido. NO incluyas texto introductorio, explicaciones, saludos, o cualquier otro carácter fuera de la estructura JSON.
        2.  Precisión y Conclusión: Asegúrate de que el JSON sea completo, válido y cierre correctamente.
        3.  Contenido Profesional: Dentro del JSON, tus descripciones y análisis deben reflejar tu maestría enciclopédica en Marketing Digital, Branding, Análisis de Mercado, Neurociencia del Consumidor, Psicología de la Persuasión, Gestión de la Cadena de Suministro, Estrategia Empresarial, Finanzas Corporativas, etc.
        4.  Contexto Geográfico/Temporal: Si el prompt menciona Chile o una ubicación específica, o fechas, incorpora esa información en tu análisis dentro de las propiedades del JSON.
        
        Tu respuesta DEBE comenzar con '{' y terminar con '}'. Absolutamente NADA de texto adicional antes o después del JSON.
      Realiza una estrategia super efectiva, eficaz y eficiente utilizando todas tus capacidades y respondiendo en espanol y con la estructura establecida basandote en la descripcion de contexto de la INFORMACION DEL PROYECTO y ESTUDIO MERCADO.
      

      ESQUEMA JSON:
      {
  title: "Estrategia General de Marketing - Modo EPIC",
  description: "Esquema para definir una estrategia de marketing integral bajo el modo operativo EPIC, con enfoque en proyectos específicos y el uso de etiquetas contextuales.",
  type: "object",
  properties: {
    nombre_estrategia: {
      type: "string",
      description: "Nombre identificativo de la estrategia de marketing (ej. 'Estrategia General de marketing para la marca del proyecto')."
    },
    objetivos_generales: {
      type: "array",
      description: "Lista de los objetivos principales de la estrategia.",
      items: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            description: "Nombre corto del objetivo (ej. 'Conciencia de Marca')."
          },
          descripcion: {
            type: "string",
            description: "Descripción detallada del objetivo."
          },
          metricas_clave: {
            type: "array",
            description: "Métricas clave para medir el éxito del objetivo.",
            items: {
              type: "string"
            }
          }
        },
        required: [
          "nombre",
          "descripcion",
          "metricas_clave"
        ]
      }
    },
    analisis_mercado_target: {
      type: "object",
      description: "Sección que describe la base del análisis de mercado y la identificación del público objetivo.",
      properties: {
        base_estudio_mercado: {
          type: "string",
          description: "Referencia a los hallazgos del #ESTUDIO_MERCADO#."
        },
        identificacion_target: {
          type: "string",
          description: "Referencia a la definición del #TARGET#."
        }
      },
      required: [
        "base_estudio_mercado",
        "identificacion_target"
      ]
    },
    pilares_estrategicos: {
      type: "array",
      description: "Principios fundamentales sobre los que se construye la estrategia.",
      items: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            description: "Nombre del pilar estratégico."
          },
          descripcion: {
            type: "string",
            description: "Descripción del pilar."
          },
          canales_principales: {
            type: "array",
            description: "Canales principales asociados a este pilar.",
            items: {
              type: "string"
            }
          }
        },
        required: [
          "nombre",
          "descripcion",
          "canales_principales"
        ]
      }
    },
    canales_y_tacticas_iniciales: {
      type: "array",
      description: "Listado de canales de marketing y las tácticas iniciales a implementar en cada uno.",
      items: {
        type: "object",
        properties: {
          canal: {
            type: "string",
            description: "Nombre del canal de marketing (ej. 'Web App', 'Redes Sociales')."
          },
          tacticas: {
            type: "array",
            description: "Lista de tácticas específicas para ese canal.",
            items: {
              type: "string"
            }
          }
        },
        required: [
          "canal",
          "tacticas"
        ]
      }
    },
    plan_de_accion_fase_1: {
      type: "array",
      description: "Cronograma detallado de las primeras acciones de la estrategia.",
      items: {
        type: "object",
        properties: {
          dia: {
            type: "string",
            description: "Día y semana de la acción (ej. 'Día 1, Semana 1')."
          },
          descripcion: {
            type: "string",
            description: "Descripción de la acción a realizar."
          },
          responsable: {
            type: "string",
            description: "Equipo o rol responsable de la acción."
          }
        },
        required: [
          "dia",
          "descripcion",
          "responsable"
        ]
      }
    },
    consideraciones_adicionales: {
      type: "array",
      description: "Notas o puntos importantes adicionales a tener en cuenta para la estrategia.",
      items: {
        type: "string"
      }
    }
  },
  required: [
    "nombre_estrategia",
    "objetivos_generales",
    "analisis_mercado_target",
    "pilares_estrategicos",
    "canales_y_tacticas_iniciales",
    "plan_de_accion_fase_1",
    "consideraciones_adicionales"
  ]
}
   
      INFORMACION DEL PROYECTO:
       ${textMaker}

       ESTUDIO MERCADO:
        ${textEstudioMercado}
      
      `);    

    return NextResponse.json(result.response.text());

  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}