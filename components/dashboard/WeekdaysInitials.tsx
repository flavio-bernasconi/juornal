import React from "react";
import styled from "styled-components";

export const WeekdaysInitials = () => {
  return (
    <Wrapper>
      {["M", "T", "W", "T", "F", "S", "S"].map((labelDay, i) => (
        <WeekDayInitial key={`${i}_${labelDay}`}>{labelDay}</WeekDayInitial>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.p`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 10px;
`;

const WeekDayInitial = styled.p`
  text-align: center;
  margin-bottom: 10px;
`;
