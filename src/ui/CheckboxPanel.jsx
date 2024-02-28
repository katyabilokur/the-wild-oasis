import styled from "styled-components";

const StyledPanel = styled.div`
  padding: 2em 0;
  display: flex;
  gap: 5rem;

  & label {
    font-weight: 500;
  }
`;

function CheckboxPanel({ children }) {
  return <StyledPanel>{children}</StyledPanel>;
}

export default CheckboxPanel;
