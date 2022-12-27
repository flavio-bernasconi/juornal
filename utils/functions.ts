import chroma from "chroma-js";
import { RANGE_STEPS, EMOJI_LIST, COLORS_STEPS } from "@/utils/constants";
import moment from "moment";

const getStepIndex = (value: number) =>
  RANGE_STEPS.findIndex((step: number, i: number) => {
    return value < step || value === step;
  });

const getEmoji = (value: number) => {
  const stepIndex = getStepIndex(value);
  return EMOJI_LIST[stepIndex] || "😵‍💫";
};

const getColor = (value: number) => {
  const scale = chroma.scale(COLORS_STEPS).domain(RANGE_STEPS);
  return scale(value);
};

const formatDate = (date: Date) => moment(date).format("DD-M-YYYY");

const getNewMonthYearValues = (month: number, year: number) => {
  const M = month;
  const Y = year;
  if (M === 12) return { month: 0, year: Y + 1 };
  if (M === -1) return { month: 11, year: Y - 1 };
  return { month: M, year: Y };
};

function getDaysInMonth(month: number | string, year: number | string) {
  let date;
  if (typeof month !== "number" && typeof month !== "number") {
    date = new Date(Number(year), Number(month), 1);
  } else {
    date = new Date(year as number, month, 1);
  }

  const days = [];
  while (date.getMonth() == month) {
    days.push(formatDate(new Date(date)));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export {
  getEmoji,
  getStepIndex,
  getColor,
  formatDate,
  getNewMonthYearValues,
  getDaysInMonth,
};
