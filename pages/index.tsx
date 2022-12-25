import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { authorize } from "../utils/authorize";
import { getXataClient } from "../utils/xata";
import { Slider } from "../components/Slider";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { formatDate } from "../utils/functions";
import { Dataset } from "../models/Dataset";
import { useAtom } from "jotai";
import { DatasetAtom } from "../store";
import { Loader } from "../components/Loader";

const Index: FC<{ dataset: Dataset; isTodayAlreadySet: boolean }> = ({
  dataset,
  isTodayAlreadySet,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [_, setDatasetStore] = useAtom(DatasetAtom);
  const { push } = useRouter();

  useEffect(() => {
    if (isTodayAlreadySet) {
      push({
        pathname: "/dashboard",
        query: { month: new Date().getMonth(), year: new Date().getFullYear() },
      });
    } else {
      setDatasetStore(dataset);
      setIsLoading(false);
    }
  }, [dataset, isTodayAlreadySet, push, setDatasetStore]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    await fetch("/api/add-record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: new Date(),
        value: Number(data.get("value")),
        note: data.get("note"),
      }),
    });

    push({
      pathname: "/dashboard",
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

export default Index;

export const getServerSideProps = async (context: any) => {
  const { req, res, query } = context;
  const { isAuthenticated, username } = await authorize(req);

  if (isAuthenticated && username) {
    const xata = getXataClient();
    const dataset = await xata.db["Jurnal-entries"]
      .filter("user.username", username)
      .getMany();

    let isTodayAlreadySet = false;
    const mappedData = dataset.reduce((acc: Dataset, datum) => {
      const formattedDate = formatDate(new Date(datum.date));
      if (formattedDate === formatDate(new Date())) {
        isTodayAlreadySet = true;
      }
      acc[formattedDate] = { ...datum };

      return acc;
    }, {});

    return {
      props: {
        dataset: mappedData,
        isTodayAlreadySet,
      },
    };
  } else {
    res.writeHead(401, {
      "WWW-Authenticate": "Basic realm='This is a private page'",
    });
    res.end();
    return {};
  }
};
