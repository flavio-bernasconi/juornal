import { CenterBlock } from "@/components/CenterBlock";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const Home = () => {
  const { push } = useRouter();
  return (
    <CenterBlock>
      <button onClick={() => signIn("", { callbackUrl: "/" })}>login</button>
    </CenterBlock>
  );
};

export default Home;
