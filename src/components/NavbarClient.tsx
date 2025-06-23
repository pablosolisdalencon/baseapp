'use client';
import Link from "next/link";
import { useAppContext } from "../app/AppContext";
import { signOut } from "next-auth/react"; // Importar signOut

function NavbarClient() { // Renombrar función para que coincida con el nombre del archivo
  const { session, status, saldo } = useAppContext();

  if (status === "loading") {
    return ( // Mostrar un estado de carga mientras se verifica la sesión
      <nav className="main-nav">
        <div className="cta-bar">
          <a href="#contacto" className="cta-link">¡Oferta Lanzamiento! Contáctanos Ahora!</a>
        </div>
        <div className="nav-container">
          <a href="/" className="nav-logo"><img src="/logo.jpg" alt="Logo" /></a> {/* Asegurar que la ruta de la imagen sea correcta */}
          <div>Cargando...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="main-nav">
      <div className="cta-bar">
        <a href="#contacto" className="cta-link">¡Oferta Lanzamiento! Contáctanos Ahora!</a>
      </div>
      <div className="nav-container">
        <a href="/" className="nav-logo"><img src="/logo.jpg" alt="Logo" /></a> {/* Asegurar que la ruta de la imagen sea correcta */}

        {session?.user ? (
          <>
            <Link href="/proyectos"> {/* Usar rutas absolutas */}
              <button className="nav-button">Proyectos</button>
            </Link>
            <div>
              <span className="coins text-sm font-bold text-white ring-1 rounded p-1 mr-3">
                🪙{saldo !== null ? saldo : '...'} {/* Mostrar '...' si el saldo aún no se ha cargado */}
              </span>
              <span className="text-sm font-bold text-blue-800 rounded p-1 bg-gray-200">
                {session.user.email}
              </span>
            </div>
            {/* Actualizar el botón de salir para usar signOut */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })} // Redirigir a la home después de salir
              className="rounded p-1 text-sm font-bold text-white bg-red-500"
            >
              Salir
            </button>
          </>
        ) : (
          <div className="nav-links">
            <a href="/#nosotros" className="nav-link">Nosotros</a> {/* Usar rutas absolutas */}
            <a href="/#catalogo" className="nav-link">Catálogo</a> {/* Usar rutas absolutas */}
            <a href="/#contacto" className="nav-link">Contacto</a> {/* Usar rutas absolutas */}
            <Link href="/api/auth/signin"> {/* Enlace corregido para iniciar sesión */}
              <button className="bg-sky-500 nav-button">Ingresar</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavbarClient; // Exportar con el nuevo nombre