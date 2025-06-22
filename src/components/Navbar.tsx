'use client';
import Link from "next/link";
import { useAppContext } from "../app/AppContext";

function Navbar() {
  const { session, saldo } = useAppContext();

  return (
    <nav className="main-nav">
      <div className="cta-bar">
        <a href="#contacto" className="cta-link">¡Oferta Lanzamiento! Contáctanos Ahora!</a>
      </div>
      <div className="nav-container">
        <a href="/" className="nav-logo"><img src="logo.jpg" alt="Logo" /></a>

        {session?.user ? (
          <>
            <Link href="./proyectos">
              <button className="nav-button">Proyectos</button>
            </Link>
            <div>
              <span className="coins text-sm font-bold text-white ring-1 rounded p-1 mr-3">
                🪙{saldo}
              </span>
              <span className="text-sm font-bold text-blue-800 rounded p-1 bg-gray-200">
                {session.user.email}
              </span>
            </div>
            <Link href="./logout">
              <button className="rounded p-1 text-sm font-bold text-white bg-red-500">Salir</button>
            </Link>
          </>
        ) : (
          <div className="nav-links">
            <a href="./#nosotros" className="nav-link">Nosotros</a>
            <a href="./#catalogo" className="nav-link">Catálogo</a>
            <a href="./#contacto" className="nav-link">Contacto</a>
            <Link href="./login">
              <button className="bg-sky-500 nav-button">Ingresar</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;