'use client';

import React from 'react';
import styles from './EstudioMercadoDisplay.module.css'; // Opcional: si usas módulos CSS

// --- Interfaces para definir la estructura de los datos ---

interface Tendencia {
  nombre: string;
  descripcion: string;
  relevancia: string;
}

interface Oportunidad {
  nombre: string;
  descripcion: string;
  alineacion: string;
}

interface Desafio {
  nombre: string;
  descripcion: string;
}

// Estructura completa del objeto EstudioMercado
interface EstudioMercado {
  nombre_del_estudio: string;
  resumen_competitivo: string;
  tendencias_clave_mercado: Tendencia[];
  oportunidades_principales: Oportunidad[];
  desafios_clave: Desafio[];
  recomendaciones_iniciales: string;
}

// Definición de las props que el componente EstudioMercadoDisplay espera recibir
interface EstudioMercadoDisplayProps {
  Jestudio: string | null; // Puede ser un objeto EstudioMercado o null
}

const EstudioMercadoDisplay: React.FC<EstudioMercadoDisplayProps> = ({ Jestudio }) => {
  if (!Jestudio) {
    return <p>Cargando estudio de mercado o no hay datos...</p>;
  }
  const estudio = Jestudio as any;
  return (
    <div className="wcontainer">
      <h1>{estudio.nombre_del_estudio}</h1>
      <p className="wsummary">
        <strong>Resumen Competitivo:</strong> {estudio.resumen_competitivo}
      </p>

      <section className="wsection">
        <h2>Tendencias Clave del Mercado</h2>
        {estudio.tendencias_clave_mercado && estudio.tendencias_clave_mercado.length > 0 ? (
          <ul className="wlist">
            {estudio.tendencias_clave_mercado.map((tendencia: Tendencia, index: number) => (
              <li key={index} className="wlistItem">
                <h3>{tendencia.nombre}</h3>
                <p>{tendencia.descripcion}</p>
                <p><strong>Relevancia:</strong> {tendencia.relevancia}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se identificaron tendencias clave.</p>
        )}
      </section>

      <section className="wsection">
        <h2>Oportunidades Principales</h2>
        {estudio.oportunidades_principales && estudio.oportunidades_principales.length > 0 ? (
          <ul className="wlist">
            {estudio.oportunidades_principales.map((oportunidad: Oportunidad, index: number) => (
              <li key={index} className="wlistItem">
                <h3>{oportunidad.nombre}</h3>
                <p>{oportunidad.descripcion}</p>
                <p><strong>Alineación:</strong> {oportunidad.alineacion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se identificaron oportunidades principales.</p>
        )}
      </section>

      <section className="wsection">
        <h2>Desafíos Clave</h2>
        {estudio.desafios_clave && estudio.desafios_clave.length > 0 ? (
          <ul className="wist">
            {estudio.desafios_clave.map((desafio: Desafio, index: number) => (
              <li key={index} className="wlistItem">
                <h3>{desafio.nombre}</h3>
                <p>{desafio.descripcion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se identificaron desafíos clave.</p>
        )}
      </section>

      <section className="wsection">
        <h2>Recomendaciones Iniciales</h2>
        <p>{estudio.recomendaciones_iniciales}</p>
      </section>
    </div>
  );
};

export default EstudioMercadoDisplay;