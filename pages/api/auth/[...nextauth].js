import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET, // 👈 add this

  callbacks: {
    async session({ session, token }) {
      session.user.tag = session.user.name.split(" ").join("").toLowerCase();

      session.user.uid = token.sub;
      return session;
    },
  },
});
