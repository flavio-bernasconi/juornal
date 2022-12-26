import styled from "styled-components";

export const CenterBlock = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  background: white;
  height: 300px;
  width: 400px;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1em;
  box-shadow: -4px 6px 13px 0 rgba(0, 0, 0, 0.2);

  button {
    background: blue;
    border-radius: 10px;
    padding: 10px;
    border: none;
  }
`;
