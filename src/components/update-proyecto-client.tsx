"use client";
import { ChangeEvent, FormEvent, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CldUploadWidget } from 'next-cloudinary';
import { useSession } from 'next-auth/react';

interface ProyectoType {
  [key: string]: string;
  nombre: string;
  descripcion: string;
  mision: string;
  vision: string;
  texto: string;
  frase: string;
  mail: string;
  fono: string;
  logo: string;
  fondo: string;
  user: string;
}

export default function UpdateProyectoClient() {
  const { data: session } = useSession();
  const [proyectoData, setProyectoData] = useState<ProyectoType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userReady, setUserReady] = useState(false);
  const [GidProyecto, setGIdProyecto] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [fondoPreviewUrl, setFondoPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const user = session?.user?.email;
    setUserReady(!!user);

    const id = searchParams.get('id');
    setGIdProyecto(id);

    if (user && id) {
      const fetchProyecto = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/proyecto/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const jsonData: ProyectoType = await response.json();
          setProyectoData(jsonData);
          if (jsonData.logo) {
            setLogoPreviewUrl(jsonData.logo);
          }
          if (jsonData.fondo) {
            setFondoPreviewUrl(jsonData.fondo);
          }
          llenarFormulario(jsonData);
        } catch (err: any) {
          setError(`Error al cargar el proyecto: ${err.message}`);
          setProyectoData(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProyecto();
    } else {
      setIsLoading(false);
      setProyectoData(null);
    }
  }, [searchParams, session]);

  const llenarFormulario = (data: ProyectoType) => {
    for (const key in data) {
      const element = document.querySelector(`[name="${key}"]`) as HTMLInputElement | HTMLTextAreaElement;
      if (element && element.tagName !== 'BUTTON') {
        element.value = data[key as keyof ProyectoType] || '';
      }
    }
  };

  const handleLogoUpload = (result: any, widget: any) => {
    if (result && result.info && result.info.secure_url) {
      setProyectoData((prevData) => ({
        ...prevData!,
        logo: result.info.secure_url,
      }));
      setLogoPreviewUrl(result.info.secure_url);
      widget.close();
    }
  };

  const handleFondoUpload = (result: any, widget: any) => {
    if (result && result.info && result.info.secure_url) {
      setProyectoData((prevData) => ({
        ...prevData!,
        fondo: result.info.secure_url,
      }));
      setFondoPreviewUrl(result.info.secure_url);
      widget.close();
    }
  };

  const updateProyecto = async () => {
    if (proyectoData && GidProyecto) {
      const res = await fetch(`/api/proyecto/${GidProyecto}`, {
        method: "PUT",
        body: JSON.stringify(proyectoData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      router.push('proyectos');
      console.log(data);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  const submitUpdateProyecto = async () => {
    await updateProyecto();
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProyectoData((prevData) => ({
      ...prevData!,
      [e.target.name]: e.target.value,
    }));
    console.log(proyectoData);
  };

  const renderUpdateForm = () => {
    if (isLoading) {
      return <p>Cargando información del proyecto...</p>;
    }

    if (error) {
      return <p>Error al cargar la información del proyecto: {error}</p>;
    }

    if (userReady && proyectoData) {
      return (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <h1>Editar Proyecto</h1>
            <p>
              Edita la información de tu proyecto. Realiza los cambios necesarios y guarda para actualizar.
            </p>
            <h2>PASO 1</h2>

            <input onChange={handleChange} name="nombre" type="text" placeholder="Nombre del Proyecto" value={proyectoData.nombre} />
            <textarea onChange={handleChange} name="descripcion" placeholder="Descripción breve" value={proyectoData.descripcion}></textarea>
            <textarea onChange={handleChange} name="mision" placeholder="Mision" value={proyectoData.mision}></textarea>
            <textarea onChange={handleChange} name="vision" placeholder="Vision" value={proyectoData.vision}></textarea>

            <textarea onChange={handleChange} name="texto" placeholder="Texto Atractivo Principal" value={proyectoData.texto}></textarea>
            <input onChange={handleChange} name="frase" type="text" placeholder="Frase Corta Descriptiva" value={proyectoData.frase} />
            <input onChange={handleChange} name="mail" type="email" placeholder="Correo Electrónico de Contacto" value={proyectoData.mail} />
            <input onChange={handleChange} name="fono" type="text" placeholder="Número de Teléfono" value={proyectoData.fono} />
          </form>
          <CldUploadWidget uploadPreset="ewavepack" onSuccess={handleLogoUpload}>
            {({ open }) => {
              const handleOpenLogoWidget = useCallback(() => {
                open();
              }, [open]);
              return (
                <button className="upload-button" name="logo" onClick={handleOpenLogoWidget}>
                  Carga la imagen del Logotipo
                </button>
              );
            }}
          </CldUploadWidget>
          {logoPreviewUrl && (
            <div>
              <p>Vista previa del Logo:</p>
              <img src={logoPreviewUrl} alt="Vista previa del logo" style={{ maxWidth: '100px', maxHeight: '100px' }} />
            </div>
          )}
          <CldUploadWidget uploadPreset="ewavepack" onSuccess={handleFondoUpload}>
            {({ open }) => {
              const handleOpenFondoWidget = useCallback(() => {
                open();
              }, [open]);
              return (
                <button className="upload-button" name="fondo" onClick={handleOpenFondoWidget}>
                  Carga el fondo de la eWebApp
                </button>
              );
            }}
          </CldUploadWidget>
          {fondoPreviewUrl && (
            <div>
              <p>Vista previa del Fondo:</p>
              <img src={fondoPreviewUrl} alt="Vista previa del fondo" style={{ maxWidth: '100px', maxHeight: '100px' }} />
            </div>
          )}
          <hr />
          <div className="btncancelar">
            <a href="proyectos"><input type="button"  className="boton-cancelar" value="Cancelar" /></a>
          </div>
          <div className="btnfinalizar">
            <input type="button" onClick={submitUpdateProyecto} className="boton-crear-proyecto" value="Guardar" />
          </div>
        </div>
      );
    }

    return <p>{userReady ? 'Esperando ID del proyecto...' : 'Esperando información del usuario...'}</p>;
  };

  return renderUpdateForm();
}