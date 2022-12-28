import React, { useLayoutEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getColor, getDaysInMonth } from "@/utils/functions";
import { Dataset } from "@/models/Dataset";
import { useRouter } from "next/router";
import moment from "moment";
import { COLORS_STEPS } from "@/utils/constants";

type Props = {
  totalDays: number;
  populatedDays: number;
  averageColor: string;
};

const WIDTH = 350;

export const Totals = ({ totalDays, populatedDays, averageColor }: Props) => {
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

  const xScale = d3.scaleLinear().domain([0, totalDays]).range([0, WIDTH]);

  const yScale = d3.scaleLinear().domain([-50, 50]).range([200, 0]);

  return (
    <div>
      <p style={{ marginBottom: 10 }}>
        Populated days {populatedDays}/{totalDays}
      </p>
      <svg width={"100%"} height={30} ref={ref}>
        <g transform="translate(0,0)">
          <rect
            x="0"
            y="0"
            width={xScale(totalDays)}
            fill="#e6e6e6"
            height="10"
            rx="8"
          />
          <rect
            x="0"
            y="0"
            width={xScale(populatedDays)}
            fill={averageColor}
            height="10"
            rx="8"
          />
        </g>
      </svg>
    </div>
  );
};
