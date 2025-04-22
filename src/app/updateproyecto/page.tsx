"use client";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from 'next-cloudinary';

export default function UpdateProyecto() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [newProyecto, setNewProyecto] = useState<{
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
  }>({
    nombre: "",
    descripcion: "",
    mision: "",
    vision: "",
    texto: "",
    frase: "",
    mail: "",
    fono: "",
    logo: "",
    fondo: "",
    user: session?.user?.email || "",
  });

  const router = useRouter();
  const [GidProyecto, setGIdProyecto] = useState<string | null>(null);
  const [isLoadingP, setIsLoadingP] = useState(true);
  const [errorP, setErrorP] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [fondoPreviewUrl, setFondoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      console.log(id);
      setGIdProyecto(id);

      const getFichaProyecto = async () => {
        setIsLoadingP(true);
        setErrorP(null);
        try {
          const response = await fetch('api/proyecto/' + id);
          if (!response.ok) {
            throw new Error(`<br>HTTP error! in Proyecto status: ${response.status}`);
          }
          const jsonData: any = await response.json();
          setNewProyecto(jsonData);
          if (jsonData.logo) {
            setLogoPreviewUrl(jsonData.logo);
          }
          if (jsonData.fondo) {
            setFondoPreviewUrl(jsonData.fondo);
          }
          llenarFormulario();
        } catch (e: any) {
          setErrorP('<br>Error al cargar Proyecto[' + id + ']:' + e.message);
        } finally {
          setIsLoadingP(false);
        }
      };

      getFichaProyecto();
    }
    if (session?.user?.email) {
      setNewProyecto((prevProyecto) => ({
        ...prevProyecto,
        user: session.user?.email as string ?? "",
      }));
    }
  }, [searchParams, session]);

  const llenarFormulario = () => {
    for (const key in newProyecto) {
      const element = document.querySelector(`[name="${key}"]`) as HTMLInputElement | HTMLTextAreaElement;
      if (element && element.tagName !== 'BUTTON') {
        element.value = newProyecto[key as keyof typeof newProyecto] || '';
      }
    }
  };

  const handleLogoUpload = (result: any, widget: any) => {
    if (result && result.info && result.info.secure_url) {
      setNewProyecto((prevProyecto) => ({
        ...prevProyecto,
        logo: result.info.secure_url,
      }));
      setLogoPreviewUrl(result.info.secure_url);
      widget.close();
    }
  };

  const handleFondoUpload = (result: any, widget: any) => {
    if (result && result.info && result.info.secure_url) {
      setNewProyecto((prevProyecto) => ({
        ...prevProyecto,
        fondo: result.info.secure_url,
      }));
      setFondoPreviewUrl(result.info.secure_url);
      widget.close();
    }
  };

  const updateProyecto = async () => {
    const res = await fetch('api/proyecto/' + GidProyecto, {
      method: "PUT",
      body: JSON.stringify(newProyecto),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    router.push('proyectos');
    console.log(data);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateProyecto();
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewProyecto({ ...newProyecto, [e.target.name]: e.target.value });
    console.log(newProyecto);
  };

  if (status === "loading" || isLoadingP) {
    return <p>Cargando...</p>;
  }
  if (errorP) {
    return <p>Error cargando el proyecto: {errorP}</p>;
  }

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h1>Editar Proyecto</h1>
        <p>
          Edita la información de tu proyecto. Realiza los cambios necesarios y guarda para actualizar.
        </p>
        <h2>PASO 1</h2>

        <input onChange={handleChange} name="nombre" type="text" placeholder="Nombre del Proyecto" value={newProyecto.nombre} />
        <textarea onChange={handleChange} name="descripcion" placeholder="Descripción breve" value={newProyecto.descripcion}></textarea>
        <textarea onChange={handleChange} name="mision" placeholder="Mision" value={newProyecto.mision}></textarea>
        <textarea onChange={handleChange} name="vision" placeholder="Vision" value={newProyecto.vision}></textarea>

        <textarea onChange={handleChange} name="texto" placeholder="Texto Atractivo Principal" value={newProyecto.texto}></textarea>
        <input onChange={handleChange} name="frase" type="text" placeholder="Frase Corta Descriptiva" value={newProyecto.frase} />
        <input onChange={handleChange} name="mail" type="email" placeholder="Correo Electrónico de Contacto" value={newProyecto.mail} />
        <input onChange={handleChange} name="fono" type="text" placeholder="Número de Teléfono" value={newProyecto.fono} />
      </form>
      <CldUploadWidget uploadPreset="ewavepack" onSuccess={handleLogoUpload}>
        {({ open }) => (
          <button className="upload-button" name="logo" onClick={() => open()}>
            Carga la imagen del Logotipo
          </button>
        )}
      </CldUploadWidget>
      {logoPreviewUrl && (
        <div>
          <p>Vista previa del Logo:</p>
          <img src={logoPreviewUrl} alt="Vista previa del logo" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        </div>
      )}
      <CldUploadWidget uploadPreset="ewavepack" onSuccess={handleFondoUpload}>
        {({ open }) => (
          <button className="upload-button" name="fondo" onClick={() => open()}>
            Carga el fondo de la eWebApp
          </button>
        )}
      </CldUploadWidget>
      {fondoPreviewUrl && (
        <div>
          <p>Vista previa del Fondo:</p>
          <img src={fondoPreviewUrl} alt="Vista previa del fondo" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        </div>
      )}
      <hr />
      <div className="btnfinalizar">
        <input type="button" onClick={handleSubmit} className="boton-crear-proyecto" value="Guardar Proyecto" />
      </div>
    </div>
  );
}