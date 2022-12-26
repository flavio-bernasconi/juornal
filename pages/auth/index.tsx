import { CenterBlock } from "@/components/CenterBlock";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const Home = () => {
  const { push } = useRouter();
  return (
    <CenterBlock>
      <button onClick={() => push("/auth/register/?isRegister=true")}>
        register
      </button>
      <button onClick={() => push("/auth/register/")}>login</button>
    </CenterBlock>
  );
};

export default Home;
