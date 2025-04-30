"use client";
import { ChangeEvent, FormEvent, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from 'next-cloudinary';

export default function AddProyecto() {
  const { data: session, status } = useSession();
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [fondoPreviewUrl, setFondoPreviewUrl] = useState<string | null>(null);
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

  useEffect(() => {
    if (session?.user?.email) {
      setNewProyecto((prevProyecto) => ({
        ...prevProyecto,
        user: session.user?.email as string ?? "",
      }));
    }
  }, [session]);

 

  const createProyecto = async () => {
    const res = await fetch('api/proyecto', {
      method: "POST",
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
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewProyecto({ ...newProyecto, [e.target.name]: e.target.value });
    console.log(newProyecto);
  };


  const handleLogoUpload = (result: any, widget: any) => {
      if (result && result.info && result.info.secure_url) {
        setNewProyecto((prevData) => ({
          ...prevData!,
          logo: result.info.secure_url,
        }));
        setLogoPreviewUrl(result.info.secure_url);
        widget.close();
      }
    };

    const handleFondoUpload = (result: any, widget: any) => {
      if (result && result.info && result.info.secure_url) {
        setNewProyecto((prevData) => ({
          ...prevData!,
          fondo: result.info.secure_url,
        }));
        setFondoPreviewUrl(result.info.secure_url);
        widget.close();
      }
    };



  if (status === "loading") {
    return <p>Cargando sesión...</p>;
  }

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h1>Nuevo Proyecto</h1>
        <p>
          ¡Estamos listos para crear tus productos digitales! 🛠️ Para empezar, necesitamos conocer a fondo tu emprendimiento. Completa este formulario con toda la información relevante. ¡Esta será la base para construir herramientas digitales poderosas para tu negocio!
        </p>

        <input onChange={handleChange} name="nombre" type="text" placeholder="Nombre del Proyecto" />
        <textarea onChange={handleChange} name="descripcion" placeholder="Descripción breve"></textarea>
        <textarea onChange={handleChange} name="mision" placeholder="Mision"></textarea>
        <textarea onChange={handleChange} name="vision" placeholder="Vision"></textarea>

        <textarea onChange={handleChange} name="texto" placeholder="Texto Atractivo Principal"></textarea>
        <input onChange={handleChange} name="frase" type="text" placeholder="Frase Corta Descriptiva" />
        <input onChange={handleChange} name="mail" type="email" placeholder="Correo Electrónico de Contacto" />
        <input onChange={handleChange} name="fono" type="text" placeholder="Número de Teléfono" />
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
            <input type="button" onClick={createProyecto} className="boton-crear-proyecto" value="Guardar" />
          </div>
        </div>
  );
}