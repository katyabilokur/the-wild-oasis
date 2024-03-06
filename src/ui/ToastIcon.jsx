import styled from "styled-components";

const StyledIcon = styled.div`
  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-yellow-500);
  }
`;

function ToastIcon({ children }) {
  return <StyledIcon>{children}</StyledIcon>;
}

export default ToastIcon;
