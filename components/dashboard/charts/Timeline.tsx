import React, { useLayoutEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getColor, getDaysInMonth } from "@/utils/functions";
import { Dataset } from "@/models/Dataset";
import { useRouter } from "next/router";
import moment from "moment";

type Props = {
  dataset: number[];
  grouped: number[];
  totalDays: number;
  missingDays: number;
  monthDataset: Dataset;
};

const WIDTH = 350;

export const Timeline = ({ monthDataset }: Props) => {
  const { query } = useRouter();
  const ref = useRef<any>();

  const { month, year } = query;

  const weekendsDays = [];

  const monthDays = getDaysInMonth(month as string, year as string);

  monthDays.forEach((d) => {
    var dayOfWeek = new Date(d.split("-").reverse().join(",")).getDay();
    var isWeekend = dayOfWeek === 6;
    if (isWeekend) {
      weekendsDays.push(moment(d, "DD-MM-YYYY").toISOString());
    }
  });

  // const timeScale = d3
  //   .scaleTime()
  //   .domain([
  //     new Date(monthDays[0].split("-").reverse().join(",")),
  //     new Date(monthDays[monthDays.length - 1].split("-").reverse().join(",")),
  //   ])
  //   .range([0, WIDTH]);

  const xScale = d3
    .scaleBand()
    .domain(monthDays)
    .range([0, WIDTH - 30])
    .padding(0.2);

  const yScale = d3.scaleLinear().domain([-50, 50]).range([200, 0]);

  return (
    <div>
      <h1>Histogram</h1>
      <svg width={"100%"} height={500} ref={ref} style={{ paddingTop: 20 }}>
        <g transform="translate(0,20)">
          {yScale.ticks(11).map((tick, i) => (
            <>
              <line
                key={tick}
                stroke="grey"
                opacity={0.2}
                strokeWidth="0.4"
                x1={30}
                y1={yScale(tick)}
                x2={WIDTH}
                y2={yScale(tick)}
              />
              <text key={i} fontSize={11} y={yScale(tick)} x="0">
                {tick}
              </text>
            </>
          ))}
          {monthDays.map((d, i) => {
            return (
              <rect
                key={`${i}_${monthDataset[d]?.value}`}
                x={(xScale(d) || 0) + 30}
                y={yScale(Math.max(0, monthDataset[d]?.value))}
                rx={4}
                fill={getColor(monthDataset[d]?.value).hex()}
                stroke={getColor(monthDataset[d]?.value).darken(2).hex()}
                width={xScale.bandwidth()}
                height={
                  yScale(monthDataset[d]?.value)
                    ? Math.abs(yScale(monthDataset[d]?.value) - yScale(0))
                    : 0
                }
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
