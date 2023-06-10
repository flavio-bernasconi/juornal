import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { Slider } from "../components/Slider";
import { useRouter } from "next/router";
import { Dataset } from "../models/Dataset";
import { useAtom } from "jotai";
import { DatasetAtom } from "../store";
import { Loader } from "../components/Loader";
import { getSession } from "next-auth/react";
import { updateRecord } from "@/utils/api/records";

const AddEntry: FC<{ dataset: Dataset; isTodayAlreadySet: boolean }> = ({
  dataset,
  isTodayAlreadySet,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [_, setDatasetStore] = useAtom(DatasetAtom);
  const { push } = useRouter();

  useEffect(() => {
    setDatasetStore(dataset);
    setIsLoading(false);
  }, [dataset, isTodayAlreadySet, push, setDatasetStore]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    await updateRecord({
      body: {
        date: new Date().toISOString(),
        value: Number(data.get("value")),
        note: data.get("note"),
      },
    });

    push({
      pathname: "/",
      query: { month: new Date().getMonth(), year: new Date().getFullYear() },
    });
  };

  if (isLoading) return <Loader />;

  return (
    <main>
      <Head>
        <link rel="stylesheet" href="https://unpkg.com/mvp.css" />
      </Head>
      <Slider onSubmit={onSubmit} />
    </main>
  );
};

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/auth/`,
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default AddEntry;
