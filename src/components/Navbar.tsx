'use client';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Navbar(){

    const {data: session } = useSession()
    return(
        <nav className="shadow-md py-2 bg-darkblue">
            

            {session?.user ? (
                // USUARIO LOGEADO
                <div className="container mx-auto flex items-center justify-between">

                <div className="flex items-center space-x-4">
                <Link href="/"><button className="text-gray-700 hover:text-gray-900 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button></Link>
                <Link href="/proyectos"><button className="text-gray-700 hover:text-gray-900 focus:outline-none">
                    Proyectos
                </button></Link>
                <Link href="/appmaker"><button className="text-gray-700 hover:text-gray-900 focus:outline-none">
                    AppMaker
                </button></Link>
                <Link href="/appviewer"><button className="text-gray-700 hover:text-gray-900 focus:outline-none">
                    AppViewer
                </button></Link>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <img src={session.user.image as string} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{session.user.name}</p>
                        <p className="text-xs text-gray-600">{session.user.email}</p>
                    </div>
                </div>
                <Link href="/logout"><button className="bg-red-500 hover:bg-red-700 text-white text-xs font-semibold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                    Cerrar Sesión
                </button></Link>
            </div>

            </div>
            
            ):(

                // USUARIO NO  ESTA LOGEADO
                <Link href="/login"><button onClick={()=> signIn()} className="bg-sky-500 px-3 py-2 rounded">
                    Sign In
                </button></Link>

            )}
            




            







            

            
        
    </nav>
    );
}

export default Navbar