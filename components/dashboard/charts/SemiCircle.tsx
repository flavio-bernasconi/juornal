import React from "react";
import * as d3 from "d3";
import { MonthDatasetAtom } from "@/store";
import { useAtom } from "jotai";
import { getColor, getDaysInMonth } from "@/utils/functions";
import { useRouter } from "next/router";
import { DefaultArcObject } from "d3";

export const SemiCircle = () => {
  const { query } = useRouter();

  const [monthDatasetStore] = useAtom(MonthDatasetAtom);
  const { month, year } = query;

  const monthDays = getDaysInMonth(month as string, year as string);

  if (!monthDatasetStore) return null;

  const arcGenerator = (i: number) =>
    d3
      .arc()
      .outerRadius((i + 1) * 5)
      .innerRadius(0)
      .startAngle(-Math.PI / 4)
      .endAngle(Math.PI / 4);

  return (
    <svg height={180} width={350}>
      {monthDays
        .map((x, i) => {
          return (
            <path
              key={i}
              transform="translate(175,160)"
              fill={
                monthDatasetStore[x]
                  ? getColor(monthDatasetStore[x]?.value).hex()
                  : "white"
              }
              // @ts-ignore
              d={arcGenerator(i)()}
            />
          );
        })
        .reverse()}
      {/* {monthDays.map((x, i) => (
        <line
          key={i}
          y1="0"
          y2="50"
          x1={i + 20 + i * 7}
          x2={i + 20 + i * 7}
          strokeWidth="5"
          stroke={getColor(monthDatasetStore[x]?.value).hex()}
        />
      ))} */}
      {/* <path transform="translate(165,120)" fill="red" d={arcGenerator2()} />;
      <path transform="translate(165,120)" fill="blue" d={arcGenerator3()} />; */}
      {/* <path transform="translate(150,120)" fill="black" d={arcGenerator()} />;
      <path transform="translate(150,120)" fill="black" d={arcGenerator()} />; */}
    </svg>
  );
};
