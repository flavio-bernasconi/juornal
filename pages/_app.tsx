import { Dataset } from "../models/Dataset";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "@next/font/google";
import { SessionProvider } from "next-auth/react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

const inter = Roboto({
  weight: ["400", "700", "900"],
  variable: "--inter-font",
});

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <button onClick={() => signOut()}>OUT</button>
      <main
        className={inter.className}
        style={{
          maxWidth: 500,
          margin: "auto",
          background: "white",
          minHeight: "100vh",
          color: "black",
          padding: 15,
        }}
      >
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}

export default App;
