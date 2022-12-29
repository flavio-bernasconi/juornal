import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { getNewMonthYearValues } from "../../utils/functions";

type Props = {
  label: string;
};

export const Head = ({ label }: Props) => {
  const { query, replace } = useRouter();
  const monthValue = Number(query.month);

  const onIconClick = (month: number) => {
    replace({
      query: { ...query, ...getNewMonthYearValues(month, Number(query.year)) },
    });
  };

  return (
    <Wrapper id="head">
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
  margin-bottom: 20px;
  justify-content: space-between;
`;

const IconsWrapper = styled.div`
  display: flex;
`;
const IconWrapper = styled.div`
  padding: 10px;
  cursor: pointer;
`;
