import styled from "styled-components";
import Button from "./Button";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem minmax(20rem, 1fr) 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:not(:has(label)) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const StyledButtonInput = styled.div`
  /* display: flex;
  gap: 0.6rem;
  width: 100%;
  justify-content: stretch; */
  display: grid;
  align-items: center;
  grid-template-columns: 7fr 1fr;
  gap: 0.6rem;
`;

const IconSet = styled.div`
  display: flex;
  gap: 1rem;
  color: var(--color-grey-400);

  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-brand-500);
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function FormRow({ label, error, children, icon = null, button = null }) {
  return (
    <StyledFormRow>
      {label && icon && (
        <IconSet>
          {icon}
          <Label htmlFor={children.props.id}>{label}</Label>
        </IconSet>
      )}
      {label && !icon && <Label htmlFor={children.props.id}>{label}</Label>}
      {!button && children}
      {button && (
        <StyledButtonInput>
          {children}
          <Button
            $variation="light"
            $size="smallIcon"
            onClick={button.onButtonClick}
            disabled={button.disabled}
          >
            {button.icon}
          </Button>
        </StyledButtonInput>
      )}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;
