import { Dataset } from "../models/Dataset";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "@next/font/google";

const inter = Roboto({
  weight: ["400", "700", "900"],
  variable: "--inter-font",
});

function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={inter.className}
      style={{
        maxWidth: 500,
        margin: "auto",
        background: "white",
        minHeight: "100vh",
        color: "black",
        padding: 30,
      }}
    >
      <Component {...pageProps} />
    </main>
  );
}

export default App;
