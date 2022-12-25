import range from "lodash/range";

const MIN = -50;
const MAX = 50;
const EMOJI_LIST = ["😭", "😕", "😐", "🙂", "🤩"];
const RANGE_STEPS = [MIN, MIN / 2, 0, MAX / 2, MAX];
const COLORS_STEPS = ["#2A4858", "#F7EBAB", "#95FF66"];

export { MIN, MAX, EMOJI_LIST, RANGE_STEPS, COLORS_STEPS };
