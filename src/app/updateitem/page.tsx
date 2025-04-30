"use client";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


interface DataType {
    id?: string;
    nombre: string;
    descripcion: string;
    foto: string;
    tipo: string;
    precio: string;
    id_proyecto?:string;
}
interface ItemType {
    id: string;
    id_proyecto?:string;
    nombre: string;
    data: ItemType[];
    foto: string;
    tipo: string;
}


export default  function Fichaitem(){


      


    const [dataI,setDataI] = useState<DataType | null>(null);
    const [isLoadingI, setIsLoadingI] = useState(true);
    const [errorI, setErrorI] = useState<string | null>(null);
   


    const [nombreProyecto,setnombreProyecto] = useState<string | null>(null);
    const [idProyecto, setIdProyecto] = useState<string | null>(null);

    const [idItem, setIdItem] = useState<string | null>(null);



    
   

    const [newItem, setNewItem ] = useState({
            id: "",
            nombre: "",
            id_proyecto: "",
            descripcion: "",
            precio: "",
            tipo: "",
            foto: ""
    });

    const router = useRouter()
     
    const createItem = async () => {
        const res = await fetch('api/item', {
            method: "POST",
            body: JSON.stringify(newItem),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        router.push(`catalogo/?id=${newItem.id_proyecto}`)
        console.log(data)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await createItem()
    }
     
    const handleChange = (
        e: ChangeEvent <HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if(!idItem){
            setNewItem({ ... newItem, [e.target.name]: e.target.value as string})     
        }else{
            setDataI({ ... dataI as DataType, [e.target.name]: e.target.value})  

        }
    
    }
      

    useEffect( () => {
        const searchParams = useSearchParams();
        const id = searchParams.get('id');
        setIdItem(id);
        const nombreProyecto = searchParams.get('nombreProyecto');
        const idProyecto = searchParams.get('idProyecto');
        setnombreProyecto(nombreProyecto);
        setIdProyecto(idProyecto);
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
                setIdProyecto(jsonData.id_proyecto as string)
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
    const fotoItem=dataI?.foto as string;
    const tipoItem=dataI?.tipo as string;
    const precioItem=dataI?.precio as string;
    const idProyectoS=idProyecto || "";


   
    return(
<div className="ficha-item-container">

        <h1 className="ficha-title">Agregar Item al Catálogo</h1>
        <h2 className="project-subtitle">Proyecto {nombreProyecto}</h2>
        <h3>{idProyectoS}</h3>
        
            
        <form className="ficha-form" onSubmit={handleSubmit}>
            <div className="form-group">
            <input onChange={handleChange} value={idProyectoS} type="hidden" id="id_royecto" />

            <label htmlFor="nombre" className="form-label">Nombre del Item</label>
                <input onChange={handleChange}  value={nombreItem as string} type="text" id="nombre" className="form-input" placeholder="Ingrese el nombre del producto o servicio"/>
            </div>

            <div className="form-group">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <textarea onChange={handleChange} id="descripcion" className="form-textarea" placeholder="Ingrese una descripción detallada" value={descripcionItem as string}></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="precio" className="form-label">Precio</label>
                <input onChange={handleChange} value={precioItem as string} type="text" id="precio" className="form-input" placeholder="Ingrese el precio" />
            </div>

            <div className="form-group">
                <label htmlFor="foto" className="form-label">Foto</label>
               
            </div>

            <div className="form-group">
                <label className="form-label">Tipo de Item</label>
                <div className="radio-group">
             
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="button-agregar-item">Agregar</button>
            </div>
        </form>
            
    </div>
    );
}
/*

 <input onChange={handleChange} type="file" id="foto" className="form-input"/>



        <!--<div className="radio-label">{tipoItem}
                       <input onChange={handleChange} type="radio" className="radio-input" name="tipo" value="producto" id="producto" checked/>
                        <label htmlFor="producto" className="ml-2">Producto</label>
                    </div>
                    <div className="radio-label">
                        <input onChange={handleChange} type="radio" className="radio-input" name="tipo" value="servicio" id="servicio"/>
                        <label htmlFor="servicio" className="ml-2">Servicio</label>
                    </div>-->
*/