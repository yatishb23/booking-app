import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // ✅ GOOGLE OAUTH
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            headers: { "Content-Type": "application/json" }
          });

          const data = await res.json();

          if (res.ok && data?.success) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              image: data.user.image,
            };
          }

          return null;
        } catch (error) {
          console.error("Credentials login error:", error);
          return null;
        }
      }
    })
  ],

  // pages: {
  //   signIn: '/login',
  // },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

          const res = await fetch(`${backendUrl}/api/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: "google",
              providerId: account.providerAccountId,
            }),
          });

          const data = await res.json();

          // By default, continue login even if backend fails
          // Remove this true return and uncomment line below if backend is critical
          console.warn("Backend sync failed, but proceeding with Google login locally");
          return true; 
          // return false; 

        } catch (error) {
          console.error("Google signIn error:", error);
          // return false; // Fail login if error
          return true; // Allow login even if backend fails (dev mode)
        }
      }
      return true;
    },

    // ✅ JWT STORAGE
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // ✅ SESSION ACCESS (frontend)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };