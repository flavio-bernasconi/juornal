import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/router";
import styled from "styled-components";
import { CenterBlock } from "@/components/CenterBlock";

const Register = () => {
  const { push, query } = useRouter();
  const { isRegister } = query;

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) return;

    // try {
    setIsLoading(true);
    const response = await signIn("credentials", {
      email,
      password,
      ...(isRegister && { username: data.get("username") }),
      redirect: false,
    });

    if (!response?.ok && response?.error) {
      setError(response?.error);
      setIsLoading(false);
    }

    if (response?.ok) {
      push("/");
    }
    // } catch (error) {
    //   console.error({ error });
    //   setIsLoading(false);
    // }
  };

  if (isLoading) return <Loader />;

  return (
    <CenterBlock>
      <Form onSubmit={onSubmit}>
        <input type="email" name="email" required placeholder="email" />{" "}
        <input
          type="password"
          name="password"
          required
          placeholder="password"
        />
        {isRegister && (
          <input type="text" name="username" placeholder="username" />
        )}
        <button type="submit">{isRegister ? "register" : "login"}</button>
      </Form>
      <h2>{error}</h2>
    </CenterBlock>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;
  input {
    border-radius: 10px;
    border: 1px solid blue;
    background-color: white;
    color: black;
    padding: 10px 14px;
  }
`;

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default Register;
