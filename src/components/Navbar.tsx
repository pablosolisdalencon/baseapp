'use client';
import Link from "next/link";
import { useSession, signIn, signOut } from 'next-auth/react';
import DisplayTokens from "./tokens/displayTokens";

function Navbar() {
  const { data: session } = useSession();
  
  return (
    <nav className="main-nav">
      <div className="cta-bar">
        <a href="#contacto" className="cta-link">¡Oferta Lanzamiento! Contáctanos Ahora!</a>
      </div>
         {session?.user ? (<div>
              <><DisplayTokens/></>
              <span className="text-xs font-bold text-blue-800 rounded p-1 bg-gray-200">
                {session.user.email}
              </span>
            </div>
        ) : (
          <></>
        )}

      <div className="nav-container">
        <a href="/" className="nav-logo"><img src="/logo.jpg" alt="Logo" /></a>

        {session?.user ? (
          <>
            <Link href="/proyectos">
              <button className="nav-button">Proyectos</button>
            </Link>
            
              <button onClick={()=> signOut()} className="rounded p-1 text-sm font-bold text-white bg-red-500">Salir</button>
          </>
        ) : (
          <div className="nav-links">
            <a href="/#nosotros" className="nav-link">Nosotros</a>
            <a href="/#catalogo" className="nav-link">Catálogo</a>
            <a href="/#contacto" className="nav-link">Contacto</a>
            
              <button onClick={()=> signIn()} className="bg-sky-500 nav-button">Ingresar</button>
          
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;