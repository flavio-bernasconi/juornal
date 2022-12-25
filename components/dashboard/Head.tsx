import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

type Props = {
  label: string;
};

export const Head = ({ label }: Props) => {
  const { query, replace } = useRouter();
  const monthValue = Number(query.month);

  const onIconClick = (month: number) => {
    replace({
      query: { ...query, month },
    });
  };

  return (
    <Wrapper>
      <h1>{label}</h1>
      <IconsWrapper>
        <IconWrapper onClick={() => onIconClick(monthValue - 1)}>
          <span>◀️</span>
        </IconWrapper>
        <IconWrapper onClick={() => onIconClick(monthValue + 1)}>
          <span>▶️</span>
        </IconWrapper>
      </IconsWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
`;

const IconsWrapper = styled.div`
  display: flex;
`;
const IconWrapper = styled.div`
  padding: 10px;
  cursor: pointer;
`;
