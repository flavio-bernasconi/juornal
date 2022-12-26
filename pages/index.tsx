import React from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

const Index = () => {
  const { data, status } = useSession();

  return <div>index</div>;
};

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login`,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default Index;
