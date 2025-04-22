"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { CldUploadWidget } from 'next-cloudinary';

export default function AddProyecto() {
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

  useEffect(() => {
    if (session?.user?.email) {
      setNewProyecto((prevProyecto) => ({
        ...prevProyecto,
        user: session.user?.email as string ?? "",
      }));
    }
  }, [session]);

  const handleLogoUpload = (result: any, widget: any) => {
    if (result && result.info && result.info.secure_url) {
      setNewProyecto((prevProyecto) => ({
        ...prevProyecto,
        logo: result.info.secure_url,
      }));
      widget.close();
    }
  };

  const handleFondoUpload = (result: any, widget: any) => {
    if (result && result.info && result.info.secure_url) {
      setNewProyecto((prevProyecto) => ({
        ...prevProyecto,
        fondo: result.info.secure_url,
      }));
      widget.close();
    }
  };

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
    await createProyecto();
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewProyecto({ ...newProyecto, [e.target.name]: e.target.value });
    console.log(newProyecto);
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
        <h2>PASO 1</h2>

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
          return (
            <button className="upload-button" name="logo" onClick={() => open()}>
              Carga la imagen del Logotipo
            </button>
          );
        }}
      </CldUploadWidget>
      <CldUploadWidget uploadPreset="ewavepack" onSuccess={handleFondoUpload}>
        {({ open }) => {
          return (
            <button className="upload-button" name="fondo" onClick={() => open()}>
              Carga el fondo de la eWebApp
            </button>
          );
        }}
      </CldUploadWidget>
      <hr />
      <div className="btnfinalizar">
        <h2>eso es todo, ahora es nuestro turno de hacer el trabajo...</h2>
        <input type="button" onClick={createProyecto} className="boton-crear-proyecto" value="Guardar Proyecto" />
      </div>
    </div>
  );
}