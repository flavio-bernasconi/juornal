import { ForceChart } from "@/components/dashboard/charts/Force";
import { DatasetAtom } from "@/store";
import { EMOJI_LIST } from "@/utils/constants";
import { getEmoji, getStepIndex } from "@/utils/functions";
import { useAtom } from "jotai";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

type Props = {
  totalDays: number;
};

export const MonthStats = ({ totalDays }: Props) => {
  const { query } = useRouter();
  const [datasetStore] = useAtom(DatasetAtom);

  const { month, year } = query;

  if (!datasetStore) return null;

  const monthDataset = Object.fromEntries(
    Object.entries(datasetStore).filter(([_, datum]) =>
      datum.date.startsWith(
        moment(`${year}-${Number(month) + 1}`, "YYYY-M").format("YYYY-MM")
      )
    )
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

  return (
    <Wrapper>
      <h3>total days = {totalDays}</h3>
      <h3>populated days = {Object.keys(monthDataset).length}</h3>
      {Object.entries(groupedByStep).map(([stepKey, value]) => (
        <div key={stepKey}>
          <p>
            {EMOJI_LIST[Number(stepKey)]} ==={" "}
            {Number((value / totalDays) * 100).toFixed(0)}% ({value})
          </p>
          <p></p>
        </div>
      ))}
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background: white;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  padding: 40px 20px;
`;
