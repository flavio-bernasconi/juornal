import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/router";

const Index = () => {
  const { push } = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      setIsLoading(true);
      const response = await signIn("credentials", {
        username: data.get("username"),
        password: data.get("password"),
        redirect: false,
      });

      if (!response?.ok && response?.error) {
        setError(response?.error);
      }

      if (response?.ok) {
        push("/");
      }
    } catch (error) {
      console.error({ error });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" name="username" />
        <input type="password" name="password" />
        <button type="submit">login</button>
      </form>
      <h2>{error}</h2>
    </div>
  );
};

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

export default Index;
