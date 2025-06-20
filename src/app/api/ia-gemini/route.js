import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose'; // For Price model
import Price from '@/models/Price'; // Import Price model
import { getServerSession } from 'next-auth/next'; // Import for session
import { authOptions } from '../auth/[...nextauth]/route'; // Import authOptions

// Define the action name for price lookup
const actionName = "generar post gemini";

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
  try {
    // 0. Connect to DB (for Price model)
    await connectDB();

    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user).id) {
      return new Response(JSON.stringify({ message: 'Unauthorized: User not authenticated.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. Fetch the price for the action
    const priceEntry = await Price.findOne({ actionName });
    if (!priceEntry) {
      return new Response(JSON.stringify({ message: `Price not found for action: ${actionName}` }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    const tokensToDecrement = priceEntry.price;
    if (typeof tokensToDecrement !== 'number' || tokensToDecrement <= 0) {
      return new Response(JSON.stringify({ message: `Invalid price configured for action: ${actionName}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Call token decrement endpoint
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = req.headers.get('host');
    const absoluteUrl = `${protocol}://${host}/api/user/decrement-tokens`;

    const tokenDecrementResponse = await fetch(absoluteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || "", // Forward cookies
      },
      body: JSON.stringify({ tokensToDecrement }),
    });

    if (!tokenDecrementResponse.ok) {
      const errorData = await tokenDecrementResponse.json().catch(() => ({ message: 'Failed to parse error response from token decrement service.' }));
      return new Response(JSON.stringify({ message: errorData.message || 'Failed to decrement tokens.' }), { status: tokenDecrementResponse.status, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. If token deduction is successful, proceed with original Gemini API logic
    const data = await req.json();
    const prompt = data.prompt;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required for Gemini API' }, { status: 400 });
    }

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
    console.error("Error in POST /api/ia-gemini:", error); // Added more specific logging
    // Check if the error is a Response object (from our custom error handling)
    if (error instanceof Response) {
        return error;
    }
    let errorMessage = 'Failed to generate content or process request.';
    if (error.message) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage, details: error.toString() }, { status: 500 });
  }
}