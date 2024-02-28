import styled from "styled-components";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 0.4fr 2fr;
  gap: 2.4rem;

  padding: 1.2rem 0 4.8rem 4.8rem;
`;

const Name = styled.p`
  font-weight: 700;
  font-size: 2rem;

  & span {
    color: var(--color-brand-700);
  }
`;

const Img = styled.img`
  display: block;
  width: 7.2rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

function FormRowHeader({ name, img }) {
  return (
    <StyledFormRow>
      {img && <Img src={img} />}
      {name && (
        <Name>
          {`A new booking for cabin "`}
          <span>{name}</span> {`"`}
        </Name>
      )}
    </StyledFormRow>
  );
}

export default FormRowHeader;
