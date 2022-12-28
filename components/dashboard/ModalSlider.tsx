import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { Slider } from "@/components/Slider";
import { LoadingAtom, NotificationAtom } from "@/store";
import { updateRecord } from "@/utils/api/records";
import { IoMdClose } from "react-icons/io";
import styled from "styled-components";

type Props = {
  value?: number;
  id?: string;
  date: string;
  note?: string | null;
};

export const ModalSlider = ({ note, value, id, date }: Props) => {
  const [, setIsDetailOpen] = useAtom(NotificationAtom);
  const [, setIsLoading] = useAtom(LoadingAtom);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      await updateRecord({
        body: {
          id,
          value: Number(data.get("value")),
          note: data.get("note"),
          date,
        },
      });
      setIsLoading(true);
    } catch (error) {
      console.error(error);
    }

    setIsDetailOpen(false);
    // window.location.reload();
  };

  console.log({ value });

  return (
    <div>
      <CloseWrapper onClick={() => setIsDetailOpen(false)}>
        <IoMdClose size={30} />
      </CloseWrapper>
      {note && <p>{note}</p>}
      {<p>{date}</p>}
      <Slider initialValue={value} onSubmit={onSubmit} />
    </div>
  );
};

const CloseWrapper = styled.div`
  background: white;
  height: 50px;
  min-width: 50px;
  max-width: 50px;
  border-radius: 50px;
  align-items: center;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: end;
`;
