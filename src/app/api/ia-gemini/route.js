import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  system_instruction: {
    parts: [
      {
        text: "Eres un experto en Marketing digital, neuroventas, RRSS optimizacion de recursos, Mercado chileno, master en efectividad en ventas, super curioso, con interes en los detalles para encontrar nuevos patrones y generar estrategias actualizadas y super efectivas, aplicando serendipia en un 80%, con lenguaje tecnico preciso, experto en psicologioa y sociologia para el marketing digital, te especializas en cada area de manera super profunda y profesional basandote en mallas curriculares, contenido publicado e investigaciones propias para lograr la mayor expertice."
      }
    ]
  },
  tools: [
    {
      codeExecution: {},
    },
    
  ],
  safety_settings: [  
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_ONLY_HIGH"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ],
  
  generation_config: { 
    temperature: 0.7,
    top_p: 0.95,
    top_k: 40,
    max_output_tokens: 2048,
    stop_sequences: ["STOP", "FIN"],  
    candidate_count: 1,
    response_mime_type: "text/plain",
    
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

    /**
     * Return the generated content as a JSON response.
     {
  // PARÁMETROS NECESARIOS
  "contents": [
    {
      "role": "user",  // Obligatorio: Especifica el rol del mensaje ("user" o "model")
      "parts": [
        {
          "text": "Explica la teoría de la relatividad general en términos simples"  // Contenido textual del mensaje
        }
        // Alternativamente, puedes incluir contenido multimedia
        // {
        //   "inline_data": {
        //     "mime_type": "image/jpeg",
        //     "data": "BASE64_ENCODED_IMAGE_DATA"
        //   }
        // }
      ]
    }
  ],
                        
  // PARÁMETROS OPCIONALES
  "model": "gemini-1.5-pro",  // Opcional: Modelo a utilizar (por defecto se usa el especificado en la URL)
  
  "system_instruction": {  // Opcional: Instrucciones de sistema para guiar el comportamiento del modelo
    "parts": [
      {
        "text": "Eres un experto en física teórica. Explica conceptos complejos en términos sencillos usando analogías."
      }
    ]
  },
  
  "tools": [  // Opcional: Herramientas disponibles para el modelo
    {
      "function_declarations": [
        {
          "name": "get_current_weather",
          "description": "Obtiene el clima actual para una ubicación dada",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "Ciudad y estado, por ejemplo 'San Francisco, CA'"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "Unidad de temperatura"
              }
            },
            "required": ["location"]
          }
        }
      ]
    }
  ],
  
  "safety_settings": [  // Opcional: Configuración personalizada de umbrales de seguridad
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_ONLY_HIGH"
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_LOW_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
  ],
  
  "generation_config": {  // Opcional: Configuración que controla la generación de respuestas
    "temperature": 0.7,  // Controla la aleatoriedad (0.0-1.0)
    "top_p": 0.95,  // Muestreo de núcleo (0.0-1.0)
    "top_k": 40,  // Número de tokens con mayor probabilidad a considerar
    "max_output_tokens": 2048,  // Número máximo de tokens en la respuesta
    "stop_sequences": ["STOP", "FIN"],  // Secuencias que detendrán la generación
    "candidate_count": 1,  // Número de respuestas alternativas a generar
    "response_mime_type": "text/plain",  // Formato de respuesta (text/plain o application/json)
    "response_schema": {  // Schema JSON para respuestas estructuradas
      "type": "object",
      "properties": {
        "summary": {
          "type": "string",
          "description": "Resumen del concepto"
        },
        "key_points": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Puntos clave sobre el concepto"
        }
      },
      "required": ["summary", "key_points"]
    }
  }
}

     */
    
    return NextResponse.json({
      ia: result.response.text(),
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}