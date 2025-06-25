'use client';

// Opcional: Importar el hook useSession para reactividad en el lado del cliente
import { useSession, signOut } from 'next-auth/react';

// El componente recibe la sesión inicial como prop desde el Server Component
export default function DashboardClient({ session: initialSession }) {
  
  // -- MÉTODO 1: Usar las props (Recomendado para la carga inicial) --
  // La sesión ya viene desde el servidor, por lo que no hay estado de carga.
  // Es la forma más eficiente de mostrar los datos iniciales.
  const userEmailFromProps = initialSession?.user?.email;

  // -- MÉTODO 2: Usar el hook `useSession` (Ideal para reactividad) --
  // El hook se sincronizará con la sesión del cliente.
  // Es útil si el estado de la sesión puede cambiar sin recargar la página (ej. logout).
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Cargando sesión...</p>
  }
  
  return (
    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
      <h2>Información de Usuario (Client Component)</h2>
      
      <h4>Datos desde props (carga inicial):</h4>
      {userEmailFromProps ? (
        <p>Email: <strong>{userEmailFromProps}</strong></p>
      ) : (
        <p>No se encontró email en las props.</p>
      )}

      <hr style={{ margin: '15px 0' }} />

      <h4>Datos desde hook <code>useSession</code> (reactivo):</h4>
      {session ? (
        <>
          <p>Email: <strong>{session.user.email}</strong></p>
          <p>Nombre: {session.user.name}</p>
          <button onClick={() => signOut()}>Cerrar Sesión</button>
        </>
      ) : (
        <p>No estás autenticado.</p>
      )}
    </div>
  );
}