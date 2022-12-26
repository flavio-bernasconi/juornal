import React from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { useAtom } from "jotai";
import { NotificationAtom } from "@/store";

type Props = {
  children?: JSX.Element | JSX.Element[] | null;
  date: string;
};

export const Modal = ({ children, date }: Props) => {
  const [isOpen, setIsOpen] = useAtom(NotificationAtom);

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={() => setIsOpen(false)} />
      <Wrapper>
        <div>
          <p>{date}</p>
          <CloseWrapper onClick={() => setIsOpen(false)}>
            <IoMdClose size={30} />
          </CloseWrapper>
        </div>
        <div>{children}</div>
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
  background: #ffffff;
  opacity: 0.7;
  z-index: 1;
`;

const Wrapper = styled.div`
  position: fixed;
  width: 90%;
  top: 10%;
  background: #578aba;
  height: 50vh;
  z-index: 2;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 1em;
  gap: 1em;
`;

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
