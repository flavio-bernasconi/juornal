import chroma from "chroma-js";
import { RANGE_STEPS, EMOJI_LIST, COLORS_STEPS } from "./constants";
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

const formatDate = (date: Date) => moment(date).format("DD-M-YYYY"); // June 1, 2019

export { getEmoji, getStepIndex, getColor, formatDate };
