import { DatasetAtom } from "@/store";
import { EMOJI_LIST } from "@/utils/constants";
import { getEmoji, getStepIndex } from "@/utils/functions";
import { useAtom } from "jotai";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  totalDays: number;
};

export const MonthStats = ({ totalDays }: Props) => {
  const { query } = useRouter();
  const [datasetStore] = useAtom(DatasetAtom);

  const { month, year } = query;

  if (!datasetStore) return null;

  const filteredDataset = Object.fromEntries(
    Object.entries(datasetStore).filter(([_, datum]) =>
      datum.date.startsWith(
        moment(`${year}-${Number(month) + 1}`, "YYYY-M").format("YYYY-MM")
      )
    )
  );

  const listValues = Object.entries(filteredDataset).map(([_, datum]) =>
    getStepIndex(datum.value)
  );

  const groupedByStep = listValues.reduce(
    (acc: { [key: string]: number }, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div>
      <h3>total days = {totalDays}</h3>
      <h3>populated days = {Object.keys(filteredDataset).length}</h3>
      {Object.entries(groupedByStep).map(([stepKey, value]) => (
        <p key={stepKey}>
          {EMOJI_LIST[Number(stepKey)]} === {value}
        </p>
      ))}
    </div>
  );
};
