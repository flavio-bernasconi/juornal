import { atom } from "jotai";
import { Dataset } from "../models/Dataset";
import { JurnalEntriesRecord } from "@/utils/xata";

const DatasetAtom = atom<Dataset | null>(null);
const NotificationAtom = atom<boolean>(false);

export { DatasetAtom, NotificationAtom };
