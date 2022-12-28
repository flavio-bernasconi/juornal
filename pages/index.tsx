import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import {
  formatDate,
  getColor,
  getDaysInMonth,
  getEmoji,
  getNewMonthYearValues,
} from "@/utils/functions";
import styled from "styled-components";
import { JurnalEntriesRecord } from "@/utils/xata";
import { Dataset } from "@/models/Dataset";
import { useAtom } from "jotai";
import { DatasetAtom, LoadingAtom, NotificationAtom } from "@/store";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/router";
import { Head } from "@/components/dashboard/Head";
import { WeekdaysInitials } from "@/components/dashboard/WeekdaysInitials";
import { MonthStats } from "@/components/dashboard/Stats/MonthStats";
import chroma from "chroma-js";
import { DraggableNotification } from "@/components/DraggableNotification";
import { getSession } from "next-auth/react";
import { Modal } from "@/components/Modal";
import { ModalSlider } from "@/components/dashboard/ModalSlider";
import { fetchAllRecords } from "@/utils/api/records";
import css from "styled-jsx/css";

const Dashboard = () => {
  const { query, replace } = useRouter();

  const [datasetStore, setDatasetStore] = useAtom(DatasetAtom);
  const [isDetailOpen, setIsDetailOpen] = useAtom(NotificationAtom);
  const [isUpdating, setIsUpdating] = useAtom(LoadingAtom);

  const [selectedDay, setSelectedDay] = useState<JurnalEntriesRecord>();
  const [isLoading, setIsLoading] = useState(true);

  const { month, year } = query;

  const areParamsNumber =
    !isNaN(Number(month)) &&
    !isNaN(Number(year)) &&
    Number(month) >= 0 &&
    Number(month) <= 11;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAllRecords({
          month: month as string,
          year: year as string,
        });
        const dataset: JurnalEntriesRecord[] = await result.json();

        const mappedData: Dataset = dataset.reduce((acc: Dataset, datum) => {
          const formattedDate = formatDate(new Date(datum.date));
          acc[formattedDate] = { ...datum };

          return acc;
        }, {});
        setDatasetStore(mappedData);
        setIsLoading(false);
        setIsUpdating(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsUpdating(false);
      }
    };
    areParamsNumber && (isUpdating || isLoading) && fetchData();
  }, [
    areParamsNumber,
    setDatasetStore,
    isLoading,
    datasetStore,
    month,
    year,
    isUpdating,
    setIsUpdating,
  ]);

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

    const validLength = initialDaysToMonday >= 0 ? initialDaysToMonday : 0;
    return Array.from(Array(validLength).keys());
  }, [listDaysMonth]);

  const onDayClick = ({
    data,
    date,
  }: {
    data?: JurnalEntriesRecord;
    date?: string;
  }) => {
    const defDate = date || data?.date;
    const defDateFormat = date ? "DD/MM/YYYY" : "YYYY-MM-DD";
    const diffing = moment().diff(moment(defDate, defDateFormat)) < 0;

    console.log(moment(date, "DD-M-YYYY").toISOString());
    if (!diffing) {
      if (date) {
        setSelectedDay({
          date: moment(date, "DD-M-YYYY").toISOString(),
        } as JurnalEntriesRecord);
        setIsDetailOpen(true);
      }
      if (data) {
        setSelectedDay(data);
        setIsDetailOpen(true);
      }
    } else {
      setIsDetailOpen(false);
    }
  };

  if (!isLoading && !areParamsNumber) return <p>error</p>;
  if (isLoading || !datasetStore || !listDaysMonth || isUpdating)
    return <Loader />;

  return (
    <>
      <Container>
        <Head
          label={moment(listDaysMonth[0], "DD-M-YYYY").format("MMMM YYYY")}
        />
        <WeekdaysInitials />
        <CalendarWrapper>
          {listOfEmptyDays.map((i) => (
            <EmptyCell key={i} />
          ))}
          {listDaysMonth.map((monthDay, i) => {
            const journalEntry = datasetStore[monthDay];
            console.log(i);

            return journalEntry ? (
              <DayWrapper
                isActive={selectedDay?.id === journalEntry.id}
                isModalOpen={isDetailOpen}
                key={monthDay}
                color={getColor(journalEntry?.value)}
                onClick={() => onDayClick({ data: journalEntry })}
              >
                <NumberOfTheMonth>
                  {moment(monthDay, "DD-M-YYYY").format("D")}
                </NumberOfTheMonth>
                {/* <h4 key={monthDay}>{getEmoji(journalEntry?.value)}</h4> */}
                <Value>{journalEntry?.value}</Value>
                {journalEntry?.note && <NoteSymbol />}
              </DayWrapper>
            ) : (
              <DayWrapper
                isActive={false}
                isModalOpen={isDetailOpen}
                key={monthDay}
                color={"white"}
                onClick={() => onDayClick({ date: monthDay })}
                // onClick={() => setIsDetailOpen(false)}
              >
                <NumberOfTheMonth>
                  {moment(monthDay, "DD-M-YYYY").format("D")}
                </NumberOfTheMonth>
              </DayWrapper>
            );
          })}
        </CalendarWrapper>
      </Container>
      <WrapperDetail>
        {isDetailOpen && selectedDay ? (
          <ModalSlider {...selectedDay} />
        ) : (
          <MonthStats totalDays={listDaysMonth.length} />
        )}
      </WrapperDetail>
      <FloatingButton>+</FloatingButton>
    </>
  );
};

const Container = styled.div`
  padding: 15px;
`;

const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 30px;
`;

const Cell = styled.div`
  min-width: calc(100% / 7);
  min-height: 50px;
  border-radius: 8px;
  padding: 0 15px;
`;

const EmptyCell = styled(Cell)`
  border: solid 1px #c4c4c4;
`;

const DayWrapper = styled(Cell)<{
  color: any;
  isActive?: boolean;
  isModalOpen?: boolean;
}>`
  color: ${({ color }) => chroma(color).darken(3).hex()};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => color};
  opacity: ${({ isActive, isModalOpen }) => {
    if (!isModalOpen || isActive) return 1;
    return 0.2;
  }};
  box-shadow: -2px 3px 8px 0
    ${({ color }) => (color === "white" ? "rgba(0, 0, 0, 0.1)" : color)};
  transition: all 0.3s;
  &:hover {
    transform: translateY(-3px);
  }
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

const FloatingButton = styled.p`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: red;
  padding: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WrapperDetail = styled.div`
  min-height: 100vh;
  background: white;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  padding: 40px 20px;
`;

export const getServerSideProps = async (context: any) => {
  const { query } = context;

  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/auth/`,
        permanent: false,
      },
    };
  }

  if (!query.month || !query.year) {
    return {
      redirect: {
        destination: `/?month=${new Date().getMonth()}&year=${new Date().getFullYear()}`,
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Dashboard;
