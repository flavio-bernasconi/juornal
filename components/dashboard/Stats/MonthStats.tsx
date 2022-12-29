import { ForceChart } from "@/components/dashboard/charts/Force";
import { SemiCircle } from "@/components/dashboard/charts/SemiCircle";
import { Timeline } from "@/components/dashboard/charts/Timeline";
import { Totals } from "@/components/dashboard/charts/Totals";
import { DatasetAtom, MonthDatasetAtom } from "@/store";
import { COLORS_STEPS } from "@/utils/constants";
import { getStepIndex } from "@/utils/functions";
import { useAtom } from "jotai";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Props = {
  totalDays: number;
};

export const MonthStats = ({ totalDays }: Props) => {
  const { query } = useRouter();
  const [datasetStore] = useAtom(DatasetAtom);
  const [monthDatasetStore, setMonthDatasetStore] = useAtom(MonthDatasetAtom);

  const { month, year } = query;
  const [first, setfirst] = useState("");

  useEffect(() => {
    setfirst(month as string);
  }, [month]);

  useEffect(() => {
    if (datasetStore) {
      const monthDataset = Object.fromEntries(
        Object.entries(datasetStore).filter(([_, datum]) => {
          return datum.date.startsWith(
            moment(`${year}-${Number(month) + 1}`, "YYYY-M").format("YYYY-MM")
          );
        })
      );
      setMonthDatasetStore(monthDataset);
    }
  }, [month, setMonthDatasetStore, datasetStore, year]);

  if (!datasetStore || !monthDatasetStore) return null;

  const listValues = Object.entries(monthDatasetStore).map(([_, datum]) =>
    getStepIndex(datum.value)
  );

  const groupedByStep = listValues.reduce(
    (acc: { [key: string]: number }, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    },
    {}
  );

  const missingDays = totalDays - Object.keys(monthDatasetStore).length;

  return (
    <>
      <Totals
        populatedDays={Object.keys(monthDatasetStore).length}
        totalDays={totalDays}
        averageColor={COLORS_STEPS[0]}
      />
      <SemiCircle />
      <h1>Charts</h1>
      <ForceChart
        dataset={[
          ...Array(missingDays),
          ...Object.values(monthDatasetStore).map((d) => d.value),
        ]}
        grouped={Object.values(groupedByStep)}
        totalDays={totalDays}
        missingDays={missingDays}
        monthDataset={monthDatasetStore}
      />
      <Timeline
        dataset={[
          ...Array(missingDays),
          ...Object.values(monthDatasetStore).map((d) => d.value),
        ]}
        grouped={Object.values(groupedByStep)}
        totalDays={totalDays}
        missingDays={missingDays}
        monthDataset={monthDatasetStore}
      />
    </>
  );
};
