"use client";
import { ChangeEvent, FormEvent, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { useSession } from 'next-auth/react';

export default function AddProyectoClient() {
  const { data: session } = useSession();
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


  const [userStory, setUserStory] = useState<{
    [key: string]: string;
    historia: string;
  }>({
    historia: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      const email = session?.user?.email as string
      setNewProyecto((prevProyecto) => ({
        ...prevProyecto,
        user: email,
      }));
    }
  }, [session]);

  const createProyecto = async () => {
    const res = await fetch("/api/proyecto", {
      method: "POST",
      body: JSON.stringify(newProyecto),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    router.push("/proyectos");
    console.log(data);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProyecto({ ...newProyecto, [e.target.name]: e.target.value });
    console.log(newProyecto);
  };

  const handleMakeData = () => {
    
    console.log("llamar a willi para que genere un data");
  };
  
  const handleMakeDataChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserStory({ ...userStory, [e.target.name]: e.target.value });
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

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h1>Nuevo Proyecto</h1>
        <img src="step0.png"/>
        <p>
          ¡Estamos listos para crear tus productos digitales! 🛠️ Para empezar, necesitamos conocer a fondo tu
          emprendimiento. Completa este formulario con toda la información clave. ¡Esta será la base para construir
          herramientas digitales impulsadas con IA poderosas para tu negocio!
        </p>
        <h2>Si ya tienes clara toda esta información completa el formulario de abajo</h2>
        <h2>Si aun no tienes esta informacion no pasa nada, cuentale tu historia a Willi, y él se encargara de crearla de manera profesional y optimizada con el boton de mas abajo.</h2>
        <textarea  onChange={handleMakeDataChange} name="historia" placeholder="Comenzando con el nombre de tu proyecto, agrega aqui todo lo que puedas decir sobre tu proyecto, no importa el formato de redaccion, solo trata de agregar la mayor cantidad de informacion posible que defina tu idea."></textarea>
        <button onClick={handleMakeData} type="button">Willi, Ayudame a redactar mi proyecto!</button>

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
          <img src={logoPreviewUrl} alt="Vista previa del logo" style={{ maxWidth: "100px", maxHeight: "100px" }} />
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
          <img src={fondoPreviewUrl} alt="Vista previa del fondo" style={{ maxWidth: "100px", maxHeight: "100px" }} />
        </div>
      )}
      <hr />
      <div className="btncancelar">
        <a href="/proyectos">
          <input type="button" className="boton-cancelar" value="Cancelar" />
        </a>
      </div>
      <div className="btnfinalizar">
        <input type="button" onClick={createProyecto} className="boton-crear-proyecto" value="Guardar" />
      </div>
    </div>
  );
}