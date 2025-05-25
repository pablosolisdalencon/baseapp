const schemaEstudioMercado = {
    id_proyecto: {
    type: "string",
    description: "valor de _id en INFORMACION PROYECTO"
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
    target_objetivo: {
    type: "string",
    description: "Definicion de targets principales basados en el análisis."
    },
    recomendaciones_iniciales: {
    type: "string",
    description: "Recomendaciones iniciales basadas en el análisis."
    }
}

const schemaEstrategiaMarketing =
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


const schemaCampaniaMarketing = {

}

export { schemaEstudioMercado, schemaEstrategiaMarketing, schemaCampaniaMarketing };