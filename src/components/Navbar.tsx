'use client';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { validarSaldo } from "./tokens/simpleTokens";
import { useSaldo } from "../app/SaldoContext";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
    let { saldo, setSaldo } = useSaldo();
    const { data: session, status } = useSession();

    useEffect(() => {
        // Solo obtener el saldo si el correo está disponible
        if (status === "authenticated" && session?.user?.email) {
            const getSaldo = async () => {
                const responseSaldo = await validarSaldo(session?.user?.email);
                if (responseSaldo) {
                    setSaldo(responseSaldo);
                }
            };
            getSaldo();
        }
    }, [status, session?.user?.email, setSaldo]);

    let presaldo = "";
    if (status === "loading") {
        presaldo = faSpinner as unknown as string;
    }

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
                            <button className="nav-button">
                                Proyectos
                            </button>
                        </Link>
                        <div>
                            <span className="coins text-sm font-bold text-white ring-1 rounded p-1 mr-3">
                                🪙{saldo}{presaldo}
                            </span>
                            <span className="text-sm font-bold text-blue-800 rounded p-1 bg-gray-200">
                                {session.user.email}
                            </span>
                        </div>
                        <Link href="./logout">
                            <button className="rounded p-1 text-sm font-bold text-white bg-red-500">
                                Salir
                            </button>
                        </Link>
                    </>
                ) : (
                    <div className="nav-links">
                        <a href="./#nosotros" className="nav-link">Nosotros</a>
                        <a href="./#catalogo" className="nav-link">Catálogo</a>
                        <a href="./#contacto" className="nav-link">Contacto</a>
                        <Link href="./login">
                            <button className="bg-sky-500 nav-button">
                                Ingresar
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;