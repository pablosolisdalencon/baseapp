'use client';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Navbar(){

    const {data: session } = useSession()
    return(

    <nav className="main-nav">
        <div className="cta-bar">
            <a href="#contacto" className="cta-link">¡Oferta Lanzamiento! Contáctanos Ahora!</a>
        </div>
        <div className="nav-container">
            <a href="/" className="nav-logo"><img src="logo.jpg"/></a>
            
                
                {session?.user ? (
                    <div className="nav-links">
                    <a href="./proyectos" className="nav-button">Proyectos</a>
                    </div>
                ):(
                    <div className="nav-links"> 
                    <a href="./#nosotros" className="nav-link">Nosotros</a>
                <a href="./#catalogo" className="nav-link">Catálogo</a>
                <a href="./#contacto" className="nav-link">Contacto</a>
                    <Link href="./login"><button onClick={()=> signIn()} className="bg-sky-500 nav-button">
                    Ingresar
                </button></Link>
                </div>
                    
                )}
        </div>
    </nav>
    );
}

export default Navbar