import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  max-width: 30rem;
`;

function Select({ options, value, onChange, instruction = null, ...props }) {
  return (
    <StyledSelect
      onChange={onChange}
      value={value !== null ? value : ""}
      {...props}
    >
      {instruction && <option value="">{instruction}</option>}
      {options.map((option) => (
        <option
          key={option.value ? option.value : option}
          value={option.value ? option.value : option}
        >
          {option.label ? option.label : option}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
