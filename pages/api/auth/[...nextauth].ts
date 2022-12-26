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
        email: { label: "email", type: "email" },
      },
      async authorize(credentials, req) {
        const { username, password, email } = credentials as {
          username: string;
          password: string;
          email: string;
        };

        if (!password) {
          throw new Error("Missing password");
        }

        const xata = getXataClient();
        const user = await xata.db.Users.filter({ email }).getFirst();

        if (!user && !username) {
          throw new Error("Username missing");
        }

        if (!user && username) {
          const hashedPassword = await hash(password, 10);
          const newUser = await xata.db.Users.create({
            username,
            password: hashedPassword,
            email,
          });

          const { password: x, ...userInfo } = newUser;

          return userInfo;
        }

        const passwordDb = user?.password;
        const passwordsMatch = await compare(password, passwordDb as string);
        if (!passwordsMatch) {
          throw new Error("Password doesn't match");
        }

        return user;
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
