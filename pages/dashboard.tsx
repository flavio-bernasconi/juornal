import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { formatDate, getColor, getEmoji } from "../utils/functions";
import styled, { keyframes } from "styled-components";
import chroma from "chroma-js";
import { JurnalEntriesRecord, XataClient, getXataClient } from "../utils/xata";
import { Dataset } from "../models/Dataset";
import { useAtom } from "jotai";
import { DatasetAtom } from "../store";
import { authorize } from "../utils/authorize";
import { TbNotes } from "react-icons/tb";
import { Loader } from "../components/Loader";
import { useRouter } from "next/router";
import { Head } from "../components/dashboard/Head";
import { WeekdaysInitials } from "../components/dashboard/WeekdaysInitials";

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(formatDate(new Date(date)));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

const Dashboard = () => {
  const { query, replace } = useRouter();
  const [datasetStore, setDatasetStore] = useAtom(DatasetAtom);

  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const { month, year } = query;
  const monthValue = Number(query.month);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 70) {
      replace({
        query: { ...query, month: monthValue + 1 },
      });
    }

    if (touchStart - touchEnd < -70) {
      replace({
        query: { ...query, month: monthValue - 1 },
      });
    }
  };

  const areParamsNumber =
    !isNaN(Number(month)) &&
    !isNaN(Number(year)) &&
    Number(month) > 0 &&
    Number(month) <= 11;

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(
        `/api/get-records/?month=${encodeURIComponent(
          Number(month)
        )}&year=${encodeURIComponent(Number(year))}`
      );
      const dataset: JurnalEntriesRecord[] = await result.json();

      const mappedData: Dataset = dataset.reduce((acc: Dataset, datum) => {
        const formattedDate = formatDate(new Date(datum.date));
        acc[formattedDate] = { ...datum };

        return acc;
      }, {});
      setDatasetStore(mappedData);
      setIsLoading(false);
    };
    areParamsNumber && isLoading && fetchData();
  }, [areParamsNumber, setDatasetStore, isLoading, datasetStore, month, year]);

  const listDaysMonth = useMemo(
    () => areParamsNumber && getDaysInMonth(Number(month), Number(year)),
    [month, year, areParamsNumber]
  );

  const listOfEmptyDays = useMemo(() => {
    if (!listDaysMonth) return [];
    const initialDaysToMonday =
      Number(
        moment(listDaysMonth[0], "DD-M-YYYY").format("d-M-YYYY").split("-")[0]
      ) - 1;

    return Array.from(Array(initialDaysToMonday).keys());
  }, [listDaysMonth]);

  if (!isLoading && !areParamsNumber) return <p>error</p>;
  if (isLoading || !datasetStore || !listDaysMonth) return <Loader />;

  return (
    <>
      <Head label={moment(listDaysMonth[0], "DD-M-YYYY").format("MMMM YYYY")} />
      <WeekdaysInitials />
      <CalendarWrapper
        onTouchStart={(touchStartEvent) => handleTouchStart(touchStartEvent)}
        onTouchMove={(touchMoveEvent) => handleTouchMove(touchMoveEvent)}
        onTouchEnd={() => handleTouchEnd()}
        className=" group-new"
      >
        {listOfEmptyDays.map((i) => (
          <EmptyCell key={i} />
        ))}

        {listDaysMonth.map((monthDay, i) => {
          return datasetStore[monthDay] ? (
            <DayWrapper color={getColor(datasetStore[monthDay]?.value)}>
              <NumberOfTheMonth>
                {moment(monthDay, "DD-M-YYYY").format("D")}
              </NumberOfTheMonth>
              <h4 key={monthDay}>{getEmoji(datasetStore[monthDay]?.value)}</h4>
              <Value>{datasetStore[monthDay]?.value}</Value>
              {datasetStore[monthDay]?.note && <NoteSymbol />}
            </DayWrapper>
          ) : (
            <DayWrapper color={"white"}></DayWrapper>
          );
        })}
      </CalendarWrapper>
    </>
  );
};

const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  /* svg {
    display: none;
  } */
`;

const AnimatedWrapper = styled.div`
  position: absolute;
  width: 100%;
  z-index: -1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  height: 394px;
`;

const EmptyCell = styled.div`
  min-width: calc(100% / 7);
  min-height: 58px;
  border-radius: 8px;
  border: solid 1px #f2f2f2;
`;

const DayWrapper = styled.div<{ color: any }>`
  position: relative;
  min-width: calc(100% / 7);
  padding: 15px;
  border-radius: 8px;
  min-height: 58px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => color};
  box-shadow: -2px 3px 5px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
  p {
    font-size: 10px;
  }
`;

const NoteSymbol = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background: red;
`;

const Value = styled.p`
  font-weight: 900;
  font-family: var(--inter-font);
`;

const NumberOfTheMonth = styled.p`
  text-align: center;
  margin-bottom: 10px;
  position: absolute;
  top: 4px;
  left: 4px;
`;

// export const getServerSideProps = async (context: any) => {
//   const { req, res, query } = context;
//   const { isAuthenticated, username } = await authorize(req);

//   if (isAuthenticated && username) {
//     const xata = getXataClient();
//     const dataset = await xata.db["Jurnal-entries"]
//       .filter("user.username", username)
//       .filter("date", {
//         $contains: moment().set("month", Number(query.month)).format("YYYY-M-"),
//       })
//       .getMany();

//     const mappedData = dataset.reduce((acc: Dataset, datum) => {
//       const formattedDate = formatDate(new Date(datum.date));
//       acc[formattedDate] = { ...datum };

//       return acc;
//     }, {});

//     return {
//       props: {
//         dataset: mappedData,
//       },
//     };
//   } else {
//     res.writeHead(401, {
//       "WWW-Authenticate": "Basic realm='This is a private page'",
//     });
//     res.end();
//     return {};
//   }
// };

export default Dashboard;
