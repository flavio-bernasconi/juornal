import { atom } from "jotai";
import { Dataset } from "../models/Dataset";
import { JurnalEntriesRecord } from "@/utils/xata";

const DatasetAtom = atom<Dataset | null>(null);
const DetailAtom = atom<{
  isOpen: boolean;
  data: unknown | JurnalEntriesRecord;
}>({
  isOpen: false,
  data: null,
});

export { DatasetAtom, DetailAtom };
