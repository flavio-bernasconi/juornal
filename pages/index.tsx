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
import { DatasetAtom, NotificationAtom } from "@/store";
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

const Dashboard = () => {
  const { query, replace } = useRouter();

  const [datasetStore, setDatasetStore] = useAtom(DatasetAtom);
  const [isDetailOpen, setIsDetailOpen] = useAtom(NotificationAtom);

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
      } catch (error) {
        console.error(error);
      }
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

    if (!diffing) {
      if (date) {
        setSelectedDay({ date } as JurnalEntriesRecord);
        setIsDetailOpen(true);
      }
      if (data) {
        setSelectedDay(data);
        setIsDetailOpen(true);
      }
    }
  };

  const closeDetail = () => {
    setSelectedDay(undefined);
    setIsDetailOpen(false);
  };

  if (!isLoading && !areParamsNumber) return <p>error</p>;
  if (isLoading || !datasetStore || !listDaysMonth) return <Loader />;

  return (
    <>
      <Head label={moment(listDaysMonth[0], "DD-M-YYYY").format("MMMM YYYY")} />
      <WeekdaysInitials />
      <CalendarWrapper>
        {listOfEmptyDays.map((i) => (
          <EmptyCell key={i} />
        ))}
        {listDaysMonth.map((monthDay) => {
          const journalEntry = datasetStore[monthDay];
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
              <h4 key={monthDay}>{getEmoji(journalEntry?.value)}</h4>
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
      <Modal date={moment(selectedDay?.date).format("D MMMM YYYY")}>
        {selectedDay?.id ? (
          <>
            <h3>{selectedDay?.note}</h3>
            <ModalSlider
              value={selectedDay?.value as number}
              id={selectedDay?.id as string}
              date={selectedDay?.date}
            />
          </>
        ) : (
          <ModalSlider
            date={moment(selectedDay?.date, "DD-M-YYYY").toISOString()}
          />
        )}
      </Modal>
      <MonthStats totalDays={listDaysMonth.length} />
      <FloatingButton>+</FloatingButton>
    </>
  );
};

const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 30px;
`;

const EmptyCell = styled.div`
  min-width: calc(100% / 7);
  min-height: 58px;
  border-radius: 8px;
  border: solid 1px #f2f2f2;
`;

const DayWrapper = styled.div<{
  color: any;
  isActive?: boolean;
  isModalOpen?: boolean;
}>`
  color: ${({ color }) => chroma(color).darken(3).saturate(2).hex()};
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

export const getServerSideProps = async (context: any) => {
  const { query } = context;

  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login`,
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
