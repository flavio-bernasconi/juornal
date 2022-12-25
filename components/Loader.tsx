import styled, { keyframes } from "styled-components";

export function Loader() {
  return (
    <Wrapper>
      <Spinner />
    </Wrapper>
  );
}

const spinnerAnimation = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #383636;
  border-radius: 50%;
  animation: ${spinnerAnimation} 1.5s linear infinite;
`;
