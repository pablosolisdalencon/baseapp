export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/proyectos", "/catalogo", "/marketing", "/contents-manager"], // Rutas protegidas
  };