import NextAuth, { Account, Session, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// También podrías usar CredentialsProvider para login con email/password
// import CredentialsProvider from "next-auth/providers/credentials";
// 
     // También podrías usar CredentialsProvider para login con email/password
     // import CredentialsProvider from "next-auth/providers/credentials";
     
     export const authOptions = {
       providers: [
         GoogleProvider({
           clientId: process.env.GOOGLE_CLIENT_ID as string,
           clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
         }),
       ],
       session: {
         strategy: 'jwt' as const, // Usar JWT para manejar la sesión
       },
       callbacks: {
         async jwt({ token, user, account }: { token: any; user?: User; account: Account | null }) {
           // Si el usuario inicia sesión, agrega el token de acceso
           if (account && account.access_token) {
             token.accessToken = account.access_token;
           }
           return token;
         },
         async session({ session, token }: { session: Session; token: any }) {
           // Agrega el token de acceso a la sesión
           session.accessToken = token.accessToken;
           return session;
         },
       },
       secret: process.env.NEXTAUTH_SECRET,
     };
     const handler = NextAuth(authOptions);
     
     export { handler as GET, handler as POST };