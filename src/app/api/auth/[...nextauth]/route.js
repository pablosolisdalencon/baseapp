import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// También podrías usar CredentialsProvider para login con email/password
// import CredentialsProvider from "next-auth/providers/credentials";
// 
     // También podrías usar CredentialsProvider para login con email/password
     // import CredentialsProvider from "next-auth/providers/credentials";
     
     export const authOptions = {
       // Configura uno o más providers de autenticación
       providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
           clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         }), 
         // ...agrega más providers aquí
       ],
       // Opcional: Callbacks para controlar lo que se guarda en el JWT
       callbacks: {
         async session({ session, token }) {
           // Hacemos que el id del usuario esté disponible en el objeto de sesión
           if (token) {
             session.user.id = token.id;
           }
           return session;
         },
         async jwt({ token, user }) {
           // En el primer inicio de sesión, el objeto 'user' está disponible
           if (user) {
             token.id = user.id;
           }
           return token;
         },
       },
       // La página de login personalizada (opcional)
       // pages: {
       //   signIn: '/auth/signin',
       // }
     };
     
     const handler = NextAuth(authOptions);
     
     export { handler as GET, handler as POST };