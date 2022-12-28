import { ForceChart } from "@/components/dashboard/charts/Force";
import { Timeline } from "@/components/dashboard/charts/Timeline";
import { Totals } from "@/components/dashboard/charts/Totals";
import { DatasetAtom } from "@/store";
import { COLORS_STEPS, EMOJI_LIST } from "@/utils/constants";
import { getColor, getEmoji, getStepIndex } from "@/utils/functions";
import chroma from "chroma-js";
import { useAtom } from "jotai";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

type Props = {
  totalDays: number;
};

export const MonthStats = ({ totalDays }: Props) => {
  const { query } = useRouter();
  const [datasetStore] = useAtom(DatasetAtom);

  const { month, year } = query;
  const [first, setfirst] = useState("");

  useEffect(() => {
    setfirst(month as string);
  }, [month]);

  if (!datasetStore) return null;

  const monthDataset = Object.fromEntries(
    Object.entries(datasetStore).filter(([_, datum]) => {
      return datum.date.startsWith(
        moment(`${year}-${Number(month) + 1}`, "YYYY-M").format("YYYY-MM")
      );
    })
  );

  const listValues = Object.entries(monthDataset).map(([_, datum]) =>
    getStepIndex(datum.value)
  );

  const groupedByStep = listValues.reduce(
    (acc: { [key: string]: number }, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    },
    {}
  );

  const missingDays = totalDays - Object.keys(monthDataset).length;
  const listColors = Object.values(monthDataset).map((d) =>
    getColor(d.value).hex()
  );
  console.log(monthDataset);
  return (
    <>
      <Totals
        populatedDays={Object.keys(monthDataset).length}
        totalDays={totalDays}
        averageColor={COLORS_STEPS[0]}
      />
      <h1>Charts</h1>
      <ForceChart
        dataset={[
          ...Array(missingDays),
          ...Object.values(monthDataset).map((d) => d.value),
        ]}
        grouped={Object.values(groupedByStep)}
        totalDays={totalDays}
        missingDays={missingDays}
        monthDataset={monthDataset}
      />
      <Timeline
        dataset={[
          ...Array(missingDays),
          ...Object.values(monthDataset).map((d) => d.value),
        ]}
        grouped={Object.values(groupedByStep)}
        totalDays={totalDays}
        missingDays={missingDays}
        monthDataset={monthDataset}
      />
    </>
  );
};
