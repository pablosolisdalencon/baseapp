import React from 'react';
import { DisplayProps, CampaniaMarketingData, DefinicionArte, Semana, Dia, Post } from '../types/marketingWorkflowTypes'; // Ajusta la ruta a donde guardaste tus tipos



const CampaniaMarketingDisplay: React.FC<DisplayProps<CampaniaMarketingData>> = ({ Input: campania, onSave, showSaveButton = false }) => {
  if (!campania) return null;
  const styles = {
    container: {
      fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      backgroundColor: '#f8f9fa',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
      maxWidth: '1000px',
      margin: '40px auto',
      color: '#343a40',
      lineHeight: '1.6',
    },
    section: {
      backgroundColor: '#ffffff',
      padding: '20px 25px',
      borderRadius: '10px',
      marginBottom: '20px',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
      borderLeft: '5px solid #007bff', // Color primario
    },
    subSection: {
      backgroundColor: '#f2f4f7',
      padding: '15px 20px',
      borderRadius: '8px',
      marginBottom: '15px',
      borderLeft: '3px solid #6c757d', // Color secundario
    },
    itemTitle: {
      color: '#0056b3', // Un azul más oscuro para títulos de ítems
      fontWeight: '600',
      marginBottom: '8px',
      fontSize: '1.1em',
    },
    list: {
      listStyleType: 'none',
      padding: '0',
      margin: '0',
    },
    listItem: {
      marginBottom: '10px',
      paddingLeft: '15px',
    },
    listItemBullet: {
      left: '0',
      color: '#28a745', // Verde para viñetas
      fontWeight: 'bold',
      fontSize: '1.2em',
    },
    heading: {
      color: '#007bff',
      marginBottom: '20px',
      borderBottom: '2px solid #e9ecef',
      paddingBottom: '10px',
      fontSize: '1.8em',
      fontWeight: '700',
    },
    subHeading: {
      color: '#343a40',
      marginBottom: '15px',
      fontSize: '1.4em',
      fontWeight: '600',
    },
    textMuted: {
      color: '#6c757d',
      fontSize: '0.9em',
      marginBottom: '5px',
    },
    // Estilos específicos para Post
    postCard: {
      backgroundColor: '#e9ecef', // Fondo más claro para los posts
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '10px',
      border: '1px solid #dee2e6',
      boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
    },
    postTitle: {
      color: '#495057',
      fontSize: '1.2em',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    postDetail: {
      marginBottom: '3px',
      fontSize: '0.95em',
    },
    postStatus: {
      fontWeight: 'bold',
      color: '#dc3545', // Rojo para pendiente, podrías usar un switch para cambiar color
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'publicado': return '#28a745'; // Verde
      case 'programado': return '#007bff'; // Azul
      case 'revisión': return '#ffc107'; // Amarillo
      case 'error': return '#dc3545'; // Rojo
      default: return '#6c757d'; // Gris para pendiente
    }
  };
  const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Si onSave existe y los datos de la estrategia están disponibles, llámalo.
    if (onSave && campania) {
      onSave(campania);
    }
  };
  console.log("##$$## CAMPANIA IS:");
  console.log(campania);
  let arte:DefinicionArte = campania.definicion_arte;
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📈 Detalle de Campaña: {campania.nombre}</h1>

      {/* Información General */}
      <div style={styles.section}>
        <h2 style={styles.subHeading}>Información General</h2>
        <p><strong style={styles.itemTitle}>Objetivo:</strong> {campania.objetivo}</p>
        <p><strong style={styles.itemTitle}>Target:</strong> {campania.target}</p>
        <p><strong style={styles.itemTitle}>Temática:</strong> {campania.tematica}</p>
        <p style={styles.textMuted}>
          <strong style={styles.itemTitle}>Duración:</strong> {campania.duracion} días 
          (del {campania.fecha_inicio} al {campania.fecha_fin})
        </p>
      </div>

      {/* Definición de Arte */}
      <div style={styles.section}>
        <h2 style={styles.subHeading}>🎨 Definición de Arte</h2>
        <p><strong style={styles.itemTitle}>Estilo de Narración:</strong> {arte.estilo_narracion}</p>
        <p><strong style={styles.itemTitle}>Colores:</strong> {arte.colores}</p>
        <p><strong style={styles.itemTitle}>Gráfica Representativa:</strong> {arte.grafica_representativa_campania}</p>
      </div>

      {/* Contenido por Semanas */}
      <div style={styles.section}>
        <h2 style={styles.subHeading}>🗓️ Plan de Contenido</h2>
        {campania.contenido.map((semana: Semana) => (
          <div key={semana.numero} style={styles.subSection}>
            <h3 style={styles.itemTitle}>Semana {semana.numero}</h3>
            <ul style={styles.list}>
              {semana.dias.map((dia: Dia) => (
                <li key={`${semana.numero}-${dia.nombre}`} style={styles.listItem}>
                  <span style={styles.listItemBullet}>•</span>
                  <strong style={styles.itemTitle}>{dia.nombre} ({dia.fecha})</strong>
                  <div style={styles.postCard}>
                    <p style={styles.postTitle}>{dia.post.titulo}</p>
                    <p style={styles.postDetail}><strong style={styles.itemTitle}>Objetivo Post:</strong> {dia.post.objetivo}</p>
                    <p style={styles.postDetail}><strong style={styles.itemTitle}>Arte:</strong> {dia.post.definicion_arte}</p>
                    <p style={styles.postDetail}><strong style={styles.itemTitle}>Tema Post:</strong> {dia.post.tema}</p>
                    <p style={styles.postDetail}><strong style={styles.itemTitle}>Texto Post:</strong> {dia.post.texto}</p>
                    <p style={styles.postDetail}><strong style={styles.itemTitle}>CTA!:</strong> {dia.post.cta}</p>
                    <p style={styles.postDetail}><strong style={styles.itemTitle}>Imagen Sugerida:</strong> {dia.post.imagen}</p>
                    <p style={styles.postDetail}>
                      <strong style={styles.itemTitle}>Hora:</strong> {dia.post.hora} | 
                      <strong style={styles.itemTitle}> Canal:</strong> {dia.post.canal}
                    </p>
                    <p style={styles.postDetail}>
                      <strong style={styles.itemTitle}>Estado:</strong> 
                      <span style={{ ...styles.postStatus, color: getStatusColor(dia.post.estado) }}>
                        {dia.post.estado}
                      </span>
                    </p>
                    <p style={styles.postDetail}><strong style={styles.itemTitle}>Fundamento:</strong> {dia.post.fundamento}</p>
                    <p style={styles.postDetail}><strong style={styles.itemTitle}>Recomendaciones Creación:</strong> {dia.post.recomendacion_creacion}</p>
                    <p style={styles.postDetail}><strong style={styles.itemTitle}>Recomendaciones Publicación y Seguimiento:</strong> {dia.post.recomendacion_publicacion_seguimiento}</p>
                    
                   
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {showSaveButton && onSave && (
        <button
          onClick={handleSaveClick}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Guardar Campania de Marketing
        </button>
      )}
    </div>
  );
};

export default CampaniaMarketingDisplay;