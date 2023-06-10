import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";
declare const tables: readonly [
  {
    readonly name: "Posts";
    readonly columns: readonly [
      {
        readonly name: "title";
        readonly type: "string";
      },
      {
        readonly name: "labels";
        readonly type: "multiple";
      },
      {
        readonly name: "slug";
        readonly type: "string";
      },
      {
        readonly name: "text";
        readonly type: "text";
      },
      {
        readonly name: "author";
        readonly type: "link";
        readonly link: {
          readonly table: "Users";
        };
      },
      {
        readonly name: "createdAt";
        readonly type: "datetime";
      },
      {
        readonly name: "views";
        readonly type: "int";
      }
    ];
  },
  {
    readonly name: "Users";
    readonly columns: readonly [
      {
        readonly name: "name";
        readonly type: "string";
      },
      {
        readonly name: "bio";
        readonly type: "text";
      },
      {
        readonly name: "username";
        readonly type: "string";
        readonly notNull: true;
        readonly defaultValue: "";
      },
      {
        readonly name: "password";
        readonly type: "string";
        readonly notNull: true;
        readonly defaultValue: "";
      },
      {
        readonly name: "email";
        readonly type: "email";
        readonly unique: true;
      }
    ];
  },
  {
    readonly name: "Jurnal-entries";
    readonly columns: readonly [
      {
        readonly name: "user";
        readonly type: "link";
        readonly link: {
          readonly table: "Users";
        };
      },
      {
        readonly name: "value";
        readonly type: "int";
        readonly notNull: true;
        readonly defaultValue: "0";
      },
      {
        readonly name: "date";
        readonly type: "string";
        readonly notNull: true;
        readonly defaultValue: "";
      },
      {
        readonly name: "note";
        readonly type: "text";
      }
    ];
  },
  {
    readonly name: "nextauth_users";
    readonly columns: readonly [
      {
        readonly name: "email";
        readonly type: "email";
      },
      {
        readonly name: "emailVerified";
        readonly type: "datetime";
      },
      {
        readonly name: "name";
        readonly type: "string";
      },
      {
        readonly name: "image";
        readonly type: "string";
      }
    ];
  },
  {
    readonly name: "nextauth_accounts";
    readonly columns: readonly [
      {
        readonly name: "user";
        readonly type: "link";
        readonly link: {
          readonly table: "nextauth_users";
        };
      },
      {
        readonly name: "type";
        readonly type: "string";
      },
      {
        readonly name: "provider";
        readonly type: "string";
      },
      {
        readonly name: "providerAccountId";
        readonly type: "string";
      },
      {
        readonly name: "refresh_token";
        readonly type: "string";
      },
      {
        readonly name: "access_token";
        readonly type: "string";
      },
      {
        readonly name: "expires_at";
        readonly type: "int";
      },
      {
        readonly name: "token_type";
        readonly type: "string";
      },
      {
        readonly name: "scope";
        readonly type: "string";
      },
      {
        readonly name: "id_token";
        readonly type: "text";
      },
      {
        readonly name: "session_state";
        readonly type: "string";
      }
    ];
  },
  {
    readonly name: "nextauth_verificationTokens";
    readonly columns: readonly [
      {
        readonly name: "identifier";
        readonly type: "string";
      },
      {
        readonly name: "token";
        readonly type: "string";
      },
      {
        readonly name: "expires";
        readonly type: "datetime";
      }
    ];
  },
  {
    readonly name: "nextauth_users_accounts";
    readonly columns: readonly [
      {
        readonly name: "user";
        readonly type: "link";
        readonly link: {
          readonly table: "nextauth_users";
        };
      },
      {
        readonly name: "account";
        readonly type: "link";
        readonly link: {
          readonly table: "nextauth_accounts";
        };
      }
    ];
  },
  {
    readonly name: "nextauth_users_sessions";
    readonly columns: readonly [
      {
        readonly name: "user";
        readonly type: "link";
        readonly link: {
          readonly table: "nextauth_users";
        };
      },
      {
        readonly name: "session";
        readonly type: "link";
        readonly link: {
          readonly table: "nextauth_sessions";
        };
      }
    ];
  },
  {
    readonly name: "nextauth_sessions";
    readonly columns: readonly [
      {
        readonly name: "sessionToken";
        readonly type: "string";
      },
      {
        readonly name: "expires";
        readonly type: "datetime";
      },
      {
        readonly name: "user";
        readonly type: "link";
        readonly link: {
          readonly table: "nextauth_users";
        };
      }
    ];
  }
];
export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;
export type Posts = InferredTypes["Posts"];
export type PostsRecord = Posts & XataRecord;
export type Users = InferredTypes["Users"];
export type UsersRecord = Users & XataRecord;
export type JurnalEntries = InferredTypes["Jurnal-entries"];
export type JurnalEntriesRecord = JurnalEntries & XataRecord;
export type NextauthUsers = InferredTypes["nextauth_users"];
export type NextauthUsersRecord = NextauthUsers & XataRecord;
export type NextauthAccounts = InferredTypes["nextauth_accounts"];
export type NextauthAccountsRecord = NextauthAccounts & XataRecord;
export type NextauthVerificationTokens =
  InferredTypes["nextauth_verificationTokens"];
export type NextauthVerificationTokensRecord = NextauthVerificationTokens &
  XataRecord;
export type NextauthUsersAccounts = InferredTypes["nextauth_users_accounts"];
export type NextauthUsersAccountsRecord = NextauthUsersAccounts & XataRecord;
export type NextauthUsersSessions = InferredTypes["nextauth_users_sessions"];
export type NextauthUsersSessionsRecord = NextauthUsersSessions & XataRecord;
export type NextauthSessions = InferredTypes["nextauth_sessions"];
export type NextauthSessionsRecord = NextauthSessions & XataRecord;
export type DatabaseSchema = {
  Posts: PostsRecord;
  Users: UsersRecord;
  "Jurnal-entries": JurnalEntriesRecord;
  nextauth_users: NextauthUsersRecord;
  nextauth_accounts: NextauthAccountsRecord;
  nextauth_verificationTokens: NextauthVerificationTokensRecord;
  nextauth_users_accounts: NextauthUsersAccountsRecord;
  nextauth_users_sessions: NextauthUsersSessionsRecord;
  nextauth_sessions: NextauthSessionsRecord;
};
declare const DatabaseClient: any;
export declare class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions);
}
export declare const getXataClient: () => XataClient;
export {};
