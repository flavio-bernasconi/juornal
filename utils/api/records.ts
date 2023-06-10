const fetchAllRecords = async ({
  month,
  year,
}: {
  month: string;
  year: string;
}) =>
  fetch(
    `/api/get-records/?month=${encodeURIComponent(
      Number(month)
    )}&year=${encodeURIComponent(Number(year))}`
  );

type Body = {
  id?: string | null;
  value: number;
  note?: FormDataEntryValue | null;
  date: string;
};

const updateRecord = async ({ body }: { body: Body }) =>
  fetch("/api/update-record", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

// const createRecord = async ({ body }: { body: Body }) =>
//   fetch("/api/add-record", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });

export { fetchAllRecords, updateRecord };
