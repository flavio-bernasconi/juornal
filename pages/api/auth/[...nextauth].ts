import { getXataClient } from "@/utils/xata";
import { compare, hash } from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        if (!username || !password) {
          throw new Error("Missing Params");
        }

        const xata = getXataClient();
        const user = await xata.db.Users.filter({ username }).getFirst();
        if (!user) {
          throw new Error("User not found");
        }

        const passwordDb = user?.password;
        const passwordsMatch = await compare(password, passwordDb as string);
        if (!passwordsMatch) {
          throw new Error("Password doesn't match");
        }

        const { password: x, bio, ...userInfo } = user;

        return userInfo;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    //     error: '/auth/error',
    // signOut: '/auth/signout'
  },
  callbacks: {
    jwt({ token, user, account }) {
      // update token
      if (user?.username) {
        token.username = user.username;
      }

      // return final_token
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token?.username) {
        session.user.username = token.username as string;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
