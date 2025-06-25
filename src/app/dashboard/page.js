import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

// Importamos el componente de cliente que crearemos a continuación
import DashboardClient from '@/components/dashboardClient';

// Esta página es un Server Component por defecto
export default async function DashboardPage() {
  // 1. Obtener la sesión en el servidor
  const session = await getServerSession(authOptions);

  // 2. Proteger la ruta. Si no hay sesión, redirigir al login.
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/dashboard'); // Redirige al login de next-auth
  }

  // 3. Si hay sesión, renderizamos la página y pasamos la sesión al componente de cliente
  return (
    <div>
      <h1>Dashboard (Server Component)</h1>
      <p>Bienvenido, esta información se renderizó en el servidor.</p>
      
      {/* Pasamos el objeto 'session' como prop al componente de cliente.
        Next.js se encarga de serializar estos datos.
      */}
      <DashboardClient session={session} />
    </div>
  );
}