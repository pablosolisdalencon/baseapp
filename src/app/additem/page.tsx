"use client";
import { ChangeEvent, FormEvent, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CldUploadWidget } from 'next-cloudinary';

export default function AddItem() {
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(null);
  const [idProyecto, setIdProyecto] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState<{
    [key: string]: string;
    nombre: string;
    descripcion: string;
    precio: string;
    tipo: string;
    foto: string;
    id_proyecto: string;
  }>({
    nombre: "",
    descripcion: "",
    precio: "",
    tipo: "",
    foto: "",
    id_proyecto: idProyecto || "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const idProyecto = searchParams.get('idProyecto');
    setIdProyecto(idProyecto);

    if (idProyecto) {
        setNewItem((prevItem) => ({
        ...prevItem,
        id_proyecto: idProyecto as string ?? "",
      }));
    }
  }, [idProyecto]);

 

  const createItem = async () => {
    const res = await fetch('api/item', {
      method: "POST",
      body: JSON.stringify(newItem),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    router.push('catalogo?id='+idProyecto);
    console.log(data);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
    console.log(newItem);
  };

  const handleFotoUpload = (result: any, widget: any) => {
      if (result && result.info && result.info.secure_url) {
        setNewItem((prevData) => ({
          ...prevData!,
          logo: result.info.secure_url,
        }));
        setFotoPreviewUrl(result.info.secure_url);
        widget.close();
      }
    };


  if (!idProyecto) {
    return (
        <div><hr /><hr /><hr /><h1>{idProyecto}Definiendo Catalogo y Proyecto para gestion de Items...</h1></div>
    );
  }

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h1>Nuevo Item de Catalogo</h1>
        <p>
          ¡Estamos listos para crear tu Catalogo! 🛠️ Para empezar, necesitamos conocer tus Productos o Servicioson toda la información relevante.
        </p>

        <input onChange={handleChange} name="nombre" type="text" placeholder="Nombre del Proyecto" />
        <textarea onChange={handleChange} name="descripcion" placeholder="Descripción breve"></textarea>
        <input onChange={handleChange} name="precio" type="text" placeholder="Precio si lo tiene" />
        TIPO:<select onChange={handleChange} name="tipo">
                <option>PRODUCTO</option>
                <option>SERVICIO</option>
            </select>
        </form>
      <CldUploadWidget uploadPreset="ewavepack" onSuccess={handleFotoUpload}>
            {({ open }) => {
              const handleOpenFotoWidget = useCallback(() => {
                open();
              }, [open]);
              return (
                <button className="upload-button" name="foto" onClick={handleOpenFotoWidget}>
                  Carga la imagen principal del Item
                </button>
              );
            }}
          </CldUploadWidget>
          {fotoPreviewUrl && (
            <div>
              <p>Vista previa de la Foto:</p>
              <img src={fotoPreviewUrl} alt="Vista previa de la foto" style={{ maxWidth: '100px', maxHeight: '100px' }} />
            </div>
          )}
          
          <hr />
          <div className="btncancelar">
            <a href="proyectos"><input type="button"  className="boton-cancelar" value="Cancelar" /></a>
          </div>
          <div className="btnfinalizar">
            <input type="button" onClick={createItem} className="boton-crear-proyecto" value="Guardar" />
          </div>
        </div>
  );
}