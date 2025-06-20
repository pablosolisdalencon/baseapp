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
                    <div className="flex items-center space-x-4">
                        <Link href="/proyectos" className="text-white hover:text-gray-200">Proyectos</Link>
                        <div className="text-sm text-gray-300">
                            <p>{session.user.email}</p>
                            <p>Tokens: {(session.user as any).tokens !== undefined ? (session.user as any).tokens : 'N/A'}</p>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                        >
                            Salir
                        </button>
                    </div>
                ):(
                    <div className="nav-links"> 
                        <a href="./#nosotros" className="nav-link">Nosotros</a>
                        <a href="./#catalogo" className="nav-link">Catálogo</a>
                        <a href="./#contacto" className="nav-link">Contacto</a>
                        <button onClick={()=> signIn()} className="bg-sky-400 hover:bg-sky-500 text-white py-1 px-3 rounded nav-button">
                            Ingresar
                        </button>
                    </div>
                )}
        </div>
    </nav>
    );
}

export default Navbar