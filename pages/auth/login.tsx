import React from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

const Index = () => {
  const { data, status } = useSession();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      await signIn("credentials", {
        username: data.get("username"),
        password: data.get("password"),
        // redirect: false,
      });
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" name="username" />
        <input type="password" name="password" />
        <button type="submit">login</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: `/addEntry`,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default Index;
