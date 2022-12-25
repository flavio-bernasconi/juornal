import { atom } from "jotai";
import { Dataset } from "../models/Dataset";

const DatasetAtom = atom<Dataset | null>(null);

export { DatasetAtom };
