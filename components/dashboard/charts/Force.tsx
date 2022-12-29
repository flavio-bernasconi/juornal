import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { SimulationNodeDatum } from "d3";
import {
  getColor,
  getDaysInMonth,
  getEmoji,
  getStepIndex,
} from "@/utils/functions";
import { Dataset } from "@/models/Dataset";
import { useRouter } from "next/router";
import { JurnalEntriesRecord } from "@/utils/xata";
import moment from "moment";
import { EMOJI_LIST, RANGE_STEPS } from "@/utils/constants";

type Props = {
  dataset: number[];
  grouped: number[];
  totalDays: number;
  missingDays: number;
  monthDataset: Dataset;
};

const WIDTH = 350;

export const ForceChart = ({
  dataset,
  grouped,
  totalDays,
  missingDays,
  monthDataset,
}: Props) => {
  const { query } = useRouter();
  const ref = useRef<any>();

  const { month, year } = query;

  const yCenter = useMemo(() => {
    const centers = [...Array(RANGE_STEPS.length)].map(
      (_, index) => 150 + 100 * index
    );
    return [...centers, 50];
  }, []);

  const nodes: unknown[] = dataset.map((d) => {
    return {
      radius: 6,
      category: typeof d === "number" ? getStepIndex(d) : yCenter.length - 1,
      fill: typeof d === "number" ? getColor(d) : "none",
    };
  });

  useLayoutEffect(() => {
    if (!ref?.current) return;
    const svgElement = d3.select(ref?.current).selectAll("g");

    d3.forceSimulation(nodes as SimulationNodeDatum[])
      .force("charge", d3.forceManyBody().strength(4))
      .force("x", d3.forceX().x(window.innerWidth / 2 - 20))
      .force(
        "y",
        d3.forceY().y((d: any) => yCenter[d.category])
      )
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.radius)
      )
      .on("tick", ticked);

    function ticked() {
      svgElement
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", (d: any) => d.radius)
        .style("fill", (d: any) => d.fill)
        .style("stroke", (d: any) =>
          d.fill === "none" ? "#c7c7c7" : d.fill.darker(2).hex()
        )
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    }
  }, [nodes, dataset, yCenter]);

  const fontScale = d3.scaleLinear().domain([0, totalDays]).range([12, 30]);
  const lineScale = d3.scaleLinear().domain([0, totalDays]).range([90, WIDTH]);

  const monthDays = getDaysInMonth(month as string, year as string);
  const groupByStep = Object.values(monthDataset).reduce(
    (acc: { [k: string]: JurnalEntriesRecord[] }, item) => {
      const prevValues = acc[getStepIndex(item.value).toString()] || [];
      prevValues.push(item);
      acc[getStepIndex(item.value).toString()] = prevValues;

      return acc;
    },
    {}
  );

  const timeScale = d3
    .scaleTime()
    .domain([
      new Date(monthDays[0].split("-").reverse().join(",")),
      new Date(monthDays[monthDays.length - 1].split("-").reverse().join(",")),
    ])
    .range([50, WIDTH]);

  const groupWithAllSteps = [...Array(RANGE_STEPS.length)].reduce(
    (acc: { [k: string]: JurnalEntriesRecord[] }, _, i) => {
      if (!Object.keys(groupByStep).includes(i.toString())) {
        acc[i] = [];
      } else {
        acc[i] = groupByStep[i];
      }
      return acc;
    },
    {}
  );

  return (
    <div>
      <svg width={"100%"} height={640} ref={ref}>
        <g></g>
        <text fontSize={fontScale(missingDays)} y={50} x={40}>
          {missingDays}
        </text>
        <text fontSize={fontScale(missingDays)} y={50} x={WIDTH - 70}>
          {Number((missingDays / totalDays) * 100).toFixed(0)}%
        </text>
        {Object.entries(groupWithAllSteps).map(([key, values], i) => {
          return (
            <>
              {values && (
                <>
                  <text
                    fontSize={fontScale(values.length)}
                    key={`d_${key}_${values.length}_${i}`}
                    y={yCenter[i] + 7}
                    x={40}
                  >
                    {values.length.toString()} {EMOJI_LIST[i]}
                  </text>
                  <text
                    fontSize={fontScale(values.length)}
                    key={`p_${i}_${values.length}_${i}`}
                    y={yCenter[i] + 7}
                    x={WIDTH - 70}
                  >
                    {Number((values.length / totalDays) * 100).toFixed(0)}%
                  </text>
                </>
              )}
              {groupByStep[i]?.map((g, y) => {
                return (
                  <line
                    key={`${y}_${i}_${g.value}_${i}`}
                    stroke={getColor(g.value).hex()}
                    strokeWidth="3"
                    x1={timeScale(new Date(g.date))}
                    y1={yCenter[i] + 30}
                    x2={timeScale(new Date(g.date))}
                    y2={yCenter[i] + 35}
                  />
                );
              })}
            </>
          );
        })}
      </svg>
    </div>
  );
};

{
  /* <line
              stroke="black"
              x1={50 * (i + 1)}
              y1={50 * (i / Math.PI)}
              x2={WIDTH / 2}
              y2="200"
            /> */
}
{
  /* <line
              stroke="black"
              stroke-width="3"
              x1={90}
              y1={yCenter[i]}
              x2={lineScale(value)}
              y2={yCenter[i]}
            /> */
}
