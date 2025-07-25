"use client";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from 'next-cloudinary';
import { UpdateItemClientProps } from "@/types/marketingWorkflowTypes";

interface DataType {
  [key: string]: string;
  nombre: string;
  descripcion: string;
  foto: string;
  precio: string;
  tipo: string;
  id_proyecto: string;
}

  
const UpdateItemClient: React.FC<UpdateItemClientProps> = ({idProyecto, nombreProyecto, idItem  }) => {
  
    const [dataI,setDataI] = useState<DataType | null>(null);
    const [isLoadingI, setIsLoadingI] = useState(true);
    const [errorI, setErrorI] = useState<string | null>(null);
    const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(null);
    const router = useRouter() 
    const id = idItem;

    useEffect( () => {
      router.refresh();
         setDataI((prevData) => ({
            ...prevData!,
            id_proyecto: idProyecto as string,
          }));

        
          if (id!=null){
            //este es el id del ITEM
            console.log(id);

        // traer ficha item

        const getFichaItem = async () => {
            setIsLoadingI(true);
            setErrorI(null);

            try {
                const response = await fetch('api/item/'+id);
                if(!response.ok){
                    throw new Error(`<br>HTTP error! in Item status: ${response.status}`);
                }

                const jsonData: DataType = await response.json();
                setDataI(jsonData);
                
                setFotoPreviewUrl(jsonData.foto);
                
                console.log(jsonData.id_proyecto);
            
            }catch (e: any){
                setErrorI('<br>Error al cargar Item['+id+']:'+e.message);
                setDataI(null);
            } finally {
                setIsLoadingI(false);
            }
        };
        getFichaItem();

       
       
        
         
        if( !getFichaItem()){
            setErrorI('<br>Algo paso ejecutando la funcion getFichaProyecto(); linea 84');
        }
    }
    

    },[]);

    
    const createItem = async () => {
      const res = await fetch('api/item/'+idItem, {
          method: "PUT",
          body: JSON.stringify(dataI),
          headers: {
              "Content-Type": "application/json"
          }
      })
      const data = await res.json()
      router.push(`catalogo/?id=${data.id_proyecto}`)
      console.log(data)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
    }
    
    const  submitUpdateItem = async () => {
      console.log(dataI);
        await createItem();
    }
    const pepe =  submitUpdateItem 
    
    const handleChange = (
        e: ChangeEvent <HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
            setDataI({ ... dataI as DataType, [e.target.name]: e.target.value})  
    }

    const handleFotoUpload = (result: any, widget: any) => {
        if (result && result.info && result.info.secure_url) {
          setDataI((prevData) => ({
            ...prevData!,
            foto: result.info.secure_url,
          }));
          setFotoPreviewUrl(result.info.secure_url);
          widget.close();
        }
      };
      
      
    if(idItem!=null){

        if(isLoadingI){
            return <p>Cargando datos del item...</p>;
        }
        if(errorI){
            return <p>Error cargando el item: {errorI}</p>;
        }

    }

   
    const nombreItem=dataI?.nombre as string;
    const descripcionItem=dataI?.descripcion as string;
    const tipoItem=dataI?.tipo as string;
    const precioItem=dataI?.precio as string;
    
    const urlCatalogo = "catalogo?idroyecto="+{idProyecto};


   
    return (
            <div className="form">
              <form onSubmit={handleSubmit}>
                <h1>Editar Item</h1>
                <h3>Catalogo de {nombreProyecto}</h3>
                <p>
                  Edita la información de tu item. Realiza los cambios necesarios y guarda para actualizar.
                </p>
                <h2>PASO 1</h2>
                <input onChange={handleChange} name="nombre" type="text" placeholder="Nombre del Item" value={nombreItem} />
                <textarea onChange={handleChange} name="descripcion" placeholder="Descripción breve" value={descripcionItem}></textarea>               
                <input onChange={handleChange} name="precio" type="text" placeholder="Precio" value={precioItem} />
                TIPO:<select onChange={handleChange} name="tipo">
                <option>{tipoItem}</option>
                <option>PRODUCTO</option>
                <option>SERVICIO</option>
            </select>
              </form>
              
              <CldUploadWidget uploadPreset="ewavepack" onSuccess={handleFotoUpload}>
                {({ open }) => {
                  const handleOpenFondoWidget = useCallback(() => {
                    open();
                  }, [open]);
                  return (
                    <button className="upload-button" name="fondo" onClick={handleOpenFondoWidget}>
                      Carga la foto del Item
                    </button>
                  );
                }}
              </CldUploadWidget>
              {fotoPreviewUrl && (
                <div>
                  <p>Vista previa del Fondo:</p>
                  <img src={fotoPreviewUrl} alt="Vista previa del fondo" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                </div>
              )}
              <hr />
              <div className="btncancelar">
                <a href={urlCatalogo}> <input type="button"  className="boton-cancelar" value="Cancelar" /></a>
              </div>
              <div className="btnfinalizar">
                <input type="button" onClick={submitUpdateItem} className="boton-crear-item" value="Guardar" />
              </div>
            </div>
          );
}
export default UpdateItemClient;