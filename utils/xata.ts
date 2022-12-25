// Generated by Xata Codegen 0.21.0. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "Posts",
    columns: [
      { name: "title", type: "string" },
      { name: "labels", type: "multiple" },
      { name: "slug", type: "string" },
      { name: "text", type: "text" },
      { name: "author", type: "link", link: { table: "Users" } },
      { name: "createdAt", type: "datetime" },
      { name: "views", type: "int" },
    ],
  },
  {
    name: "Users",
    columns: [
      { name: "name", type: "string" },
      { name: "email", type: "email" },
      { name: "bio", type: "text" },
      { name: "username", type: "string", notNull: true, defaultValue: "" },
      { name: "password", type: "string", notNull: true, defaultValue: "" },
    ],
  },
  {
    name: "Jurnal-entries",
    columns: [
      { name: "user", type: "link", link: { table: "Users" } },
      { name: "value", type: "int", notNull: true, defaultValue: "0" },
      { name: "date", type: "string", notNull: true, defaultValue: "" },
      { name: "note", type: "text" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Posts = InferredTypes["Posts"];
export type PostsRecord = Posts & XataRecord;

export type Users = InferredTypes["Users"];
export type UsersRecord = Users & XataRecord;

export type JurnalEntries = InferredTypes["Jurnal-entries"];
export type JurnalEntriesRecord = JurnalEntries & XataRecord;

export type DatabaseSchema = {
  Posts: PostsRecord;
  Users: UsersRecord;
  "Jurnal-entries": JurnalEntriesRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Flavio-Bernasconi-s-workspace-kdea3a.us-east-1.xata.sh/db/jurnal-db",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
