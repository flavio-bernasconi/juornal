import { NotificationAtom } from "@/store";
import { JurnalEntriesRecord } from "@/utils/xata";
import { useAtom } from "jotai";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/Io";
import { motion, useMotionValue, useTransform } from "framer-motion";

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const DraggableNotification = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useAtom(NotificationAtom);
  const limitRef = useRef(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  if (!isOpen) return null;

  return (
    <Limit ref={limitRef}>
      <Wrapper
        initial={false}
        // onDrag={(e: any) => {
        //   if (e.offsetX > 200 || (e.offsetX < 0 && e.offsetX < -50))
        //     setIsOpen(false);
        // }}
        drag="x"
        dragConstraints={limitRef}
        style={{ x, opacity }}
      >
        <Content>{children}</Content>
        <CloseWrapper onClick={() => setIsOpen(false)}>
          <IoMdClose size={30} />
        </CloseWrapper>
      </Wrapper>
    </Limit>
  );
};
const Limit = styled.div`
  max-width: 500px;
  overflow: hidden;
  height: auto;
  background: white;
  margin-bottom: 15px;
  box-shadow: -2px 3px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const Wrapper = styled(motion.div)`
  width: 100%;
  min-height: 100px;
  background: #5c73aa;
  border-radius: 8px;
  box-shadow: -2px 3px 8px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
`;

const Content = styled.div`
  padding: 15px;
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
`;
