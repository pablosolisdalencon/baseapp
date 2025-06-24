'use client';
import Link from "next/link";
import { useAppContext } from "../app/AppContext";
import { signOut } from "next-auth/react";

function NavbarClient() {
  const { session, status, saldo, isSaldoLoading } = useAppContext();

  // Determinar qué mostrar para el saldo
  let saldoDisplay: string | number = '...';
  if (status === "authenticated") {
    if (isSaldoLoading && saldo === null) { // Si está autenticado, cargando saldo, y aún no hay saldo
      saldoDisplay = 'Cargando...';
    } else if (saldo !== null) { // Si hay un saldo (puede ser 0)
      saldoDisplay = saldo;
    } else if (!isSaldoLoading && saldo === null) { // Si terminó de cargar y el saldo es explícitamente null (ej. error al cargar)
      saldoDisplay = 'N/A'; // O 'Error', o dejar '...'
    }
  } else if (status === "unauthenticated") {
    saldoDisplay = '...'; // O no mostrarlo en absoluto
  }
  // Si status es "loading" (sesión), saldoDisplay se queda en '...' por defecto.

  // Navbar base (estado de carga de sesión o desautenticado sin links específicos de usuario)
  const renderBaseNavbar = (isLoadingSession: boolean = false) => (
    <nav className="main-nav">
      <div className="cta-bar">
        <a href="#contacto" className="cta-link">¡Oferta Lanzamiento! Contáctanos Ahora!</a>
      </div>
      <div className="nav-container">
        <Link href="/" className="nav-logo"><img src="/logo.jpg" alt="Logo" /></Link>
        {isLoadingSession ? (
          <div>Cargando sesión...</div>
        ) : (
          <div className="nav-links">
            <a href="/#nosotros" className="nav-link">Nosotros</a>
            <a href="/#catalogo" className="nav-link">Catálogo</a>
            <a href="/#contacto" className="nav-link">Contacto</a>
            <Link href="/api/auth/signin">
              <button className="bg-sky-500 nav-button">Ingresar</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );

  if (status === "loading") {
    return renderBaseNavbar(true);
  }

  if (status === "unauthenticated") {
    return renderBaseNavbar(false);
  }

  // Usuario autenticado
  if (status === "authenticated" && session?.user) {
    return (
      <nav className="main-nav">
        <div className="cta-bar">
          <a href="#contacto" className="cta-link">¡Oferta Lanzamiento! Contáctanos Ahora!</a>
        </div>
        <div className="nav-container">
          <Link href="/" className="nav-logo"><img src="/logo.jpg" alt="Logo" /></Link>
          <>
            <Link href="/proyectos">
              <button className="nav-button">Proyectos</button>
            </Link>
            {/* Más links para usuario autenticado si los hay */}
            <div className="flex items-center gap-x-2"> {/* Contenedor para saldo e info de usuario */}
              <span className="coins text-sm font-bold text-white ring-1 rounded p-1">
                🪙{saldoDisplay}
              </span>
              <span className="text-sm font-bold text-blue-800 rounded p-1 bg-gray-200">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded p-1 text-sm font-bold text-white bg-red-500 hover:bg-red-600"
              >
                Salir
              </button>
            </div>
          </>
        </div>
      </nav>
    );
  }

  // Fallback por si algún estado no se maneja (no debería ocurrir)
  return renderBaseNavbar(false);
}

export default NavbarClient;