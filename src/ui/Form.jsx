import styled, { css } from "styled-components";

const Form = styled.form`
  overflow: hidden;
  font-size: 1.4rem;

  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 95%;
      margin: 0 auto;
    `} /* @media (max-width: var(--size-laptop)) {
    width: 90%;
  } */
`;

Form.defaultProps = {
  type: "regular",
};

export default Form;
