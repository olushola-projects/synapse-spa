import styled from "styled-components";
import { cloudyAnimation } from "@/styles/animations";

const StyledBackground = styled.div`
  background: linear-gradient(
    -45deg,
    #ee7752,
    #e73c7e,
    #23a6d5,
    #23d5ab
  );
  background-size: 400% 400%;
  animation: ${cloudyAnimation} 15s ease infinite;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0.05;
`;

export const AnimatedBackground = () => {
  return <StyledBackground />;
};
