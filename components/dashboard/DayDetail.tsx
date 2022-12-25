import { DetailAtom } from "@/store";
import { JurnalEntriesRecord } from "@/utils/xata";
import { useAtom } from "jotai";
import React, { useState } from "react";
import styled from "styled-components";

export const DayDetail = () => {
  const [modal, setModal] = useAtom(DetailAtom);

  if (!modal.isOpen) return null;

  return (
    <>
      {/* <Overlay onClick={() => setModal({ isOpen: false, data: null })} /> */}
      <Wrapper>
        <button onClick={() => setModal({ isOpen: false, data: null })}>
          close
        </button>
        <p>{(modal.data as JurnalEntriesRecord)?.date}</p>
        <p>{(modal.data as JurnalEntriesRecord)?.note}</p>
      </Wrapper>
    </>
  );
};

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  opacity: 0;
`;

const Wrapper = styled.div`
  /* position: absolute; */
  width: 100%;
  height: 100px;
  /* top: 20%;
  left: 50%; */
  background: #5c73aa;
  padding: 10px;
  border-radius: 8px;
  box-shadow: -2px 3px 8px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
`;
