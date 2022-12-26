import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { Slider } from "@/components/Slider";
import { NotificationAtom } from "@/store";
import { updateRecord } from "@/utils/api/records";
import moment from "moment";

type Props = {
  value?: number;
  id?: string;
  date: string;
};

export const ModalSlider = ({ value, id, date }: Props) => {
  const [_, setIsDetailOpen] = useAtom(NotificationAtom);

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
    } catch (error) {
      console.error(error);
    }

    setIsDetailOpen(false);
    window.location.reload();
  };

  return <Slider initialValue={value} onSubmit={onSubmit} />;
};
