import React, { useLayoutEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { SimulationNodeDatum } from "d3";
import { getColor, getDaysInMonth, getStepIndex } from "@/utils/functions";
import { Dataset } from "@/models/Dataset";
import { useRouter } from "next/router";
import { JurnalEntriesRecord } from "@/utils/xata";
import moment from "moment";

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

  const yCenter = [200, 300, 400, 500, 600, 100];

  useLayoutEffect(() => {
    if (!ref?.current) return;
    const svgElement = d3.select(ref?.current).selectAll("g");

    const nodes: unknown[] = dataset.map((d) => {
      return {
        radius: 8,
        category: d ? getStepIndex(d) : 5,
        color: d ? getColor(d).hex() : "#e9e9e9",
      };
    });

    const simulation = d3
      .forceSimulation(nodes as SimulationNodeDatum[])
      //   .force("charge", d3.forceManyBody().strength(5))
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
        .style("fill", (d: any) => d.color)
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    }
  }, []);

  const fontScale = d3.scaleLinear().domain([0, totalDays]).range([12, 30]);
  const lineScale = d3.scaleLinear().domain([0, totalDays]).range([90, WIDTH]);

  const monthDays = getDaysInMonth(month as string, year as string);
  const grupppp = Object.values(monthDataset).reduce(
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

  return (
    <div>
      <svg width={"100%"} height={800} ref={ref}>
        <g></g>
        {[...grouped, missingDays].map((value, i) => (
          <>
            {/* <line
              stroke="black"
              x1={50 * (i + 1)}
              y1={50 * (i / Math.PI)}
              x2={WIDTH / 2}
              y2="200"
            /> */}
            {/* <line
              stroke="black"
              stroke-width="3"
              x1={90}
              y1={yCenter[i]}
              x2={lineScale(value)}
              y2={yCenter[i]}
            /> */}
            {grupppp[i]?.map((g, y) => {
              return (
                <line
                  key={`${y}_${i}`}
                  stroke={getColor(g.value).hex()}
                  stroke-width="3"
                  x1={timeScale(new Date(g.date))}
                  y1={yCenter[i] + 30}
                  x2={timeScale(new Date(g.date))}
                  y2={yCenter[i] + 35}
                />
              );
            })}
            <text
              fontSize={fontScale(value)}
              key={value}
              y={yCenter[i] + 7}
              x={40}
            >
              {value.toString()} d
            </text>
          </>
        ))}
        {[...grouped, missingDays].map((value, i) => (
          <text
            fontSize={fontScale(value)}
            key={value}
            y={yCenter[i] + 7}
            x={WIDTH - 70}
          >
            {/* {value.toString()} ||||||||---- */}
            {Number((value / totalDays) * 100).toFixed(0)}%
          </text>
        ))}
      </svg>
    </div>
  );
};
