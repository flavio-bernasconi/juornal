import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { RANGE_STEPS, EMOJI_LIST, MIN, MAX } from "../utils/constants";
import { getEmoji } from "../utils/functions";

export const Slider = ({
  initialValue = 0,
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  initialValue?: number;
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e?.target.value));
  };

  const onEmojiClick = (i: number) => {
    setValue(RANGE_STEPS[i]);
  };

  return (
    <Wrapper>
      <h1>{value}</h1>
      <WrapperEmojis>
        {EMOJI_LIST.map((emoji, i) => (
          <span onClick={() => onEmojiClick(i)} key={emoji}>
            {emoji}
          </span>
        ))}
      </WrapperEmojis>
      <form onSubmit={onSubmit}>
        <input
          name="value"
          value={value}
          onChange={onChange}
          type="range"
          min={MIN}
          max={MAX}
        />
        <textarea name="note" />
        <h1>{getEmoji(value)}</h1>
        <button>send</button>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* width: 300px; */
  /* margin: 0 auto; */
  color: black;
  button {
    padding: 8px 16px;
  }
  h1 {
    text-align: center;
  }
  input {
    width: 100%;
    margin: 15px 0;
  }
  textarea {
    background: white;
    width: 100%;
    height: 100px;
    color: black;
  }
`;

const WrapperEmojis = styled.div`
  display: flex;
  justify-content: space-between;
`;
