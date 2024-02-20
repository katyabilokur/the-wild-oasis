import styled from "styled-components";

const StyledCalendar = styled.div`
  position: fixed;
  width: 30rem;
  z-index: 901;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;

  .react-calendar {
    font-family: "Poppins", sans-serif;
    color: var(--color-grey-800);
    border-radius: 2px;
    border: 1px solid var(--color-grey-300);
    padding: 1.2rem 0;
    background: var(--color-grey-0);
  }

  .react-calendar__navigation button:disabled {
    background-color: var(--color-grey-0);
  }

  .react-calendar__month-view__days__day--weekend {
    color: var(--color-grey-400);
    font-weight: 500;
  }

  .react-calendar__month-view__days__day--neighboringMonth,
  .react-calendar__decade-view__years__year--neighboringDecade,
  .react-calendar__century-view__decades__decade--neighboringCentury {
    color: var(--color-grey-100);
  }

  .react-calendar__tile:disabled {
    background-color: var(--color-grey-200);
    color: var(--color-grey-0);
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: var(--color-grey-200);
  }

  .react-calendar__tile--now {
    //background: var(--color-green-100);
    border: 1px solid var(--color-indigo-700);
  }

  .react-calendar__tile--now {
    background: inherit;
  }

  .react-calendar__tile--hasActive {
    background: var(--color-indigo-300);
    color: var(--color-grey-700);
  }

  .react-calendar__tile--active {
    background: var(--color-indigo-300);
    color: var(--color-grey-700);
  }

  .react-calendar__tile {
    max-width: 40px;
    margin: 1px 2px;
    border-radius: 2px;
    padding: 1px 0;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    color: var(--color-indigo-700);
  }

  .react-calendar__navigation {
    margin-bottom: 0.6rem;
  }

  .react-calendar__navigation button {
    margin: 1px;
    padding: 1px 0;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: var(--color-grey-400);
  }

  .react-calendar__month-view__weekdays__weekday {
    color: var(--color-grey-500);
  }

  .react-calendar-tile-blocked-left {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom right,
      transparent 50%,
      var(--color-grey-200) 0%
    );
  }

  .react-calendar-tile-blocked-right {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to top left,
      transparent 50%,
      var(--color-grey-200) 0%
    );
  }

  .react-calendar__tile--rangeStart {
    width: 100%;
    height: 100%;
    color: var(--color-grey-700);
    background: linear-gradient(
      to bottom right,
      transparent 50%,
      var(--color-indigo-300) 0%
    );
  }

  .react-calendar__tile--rangeEnd {
    width: 100%;
    height: 100%;
    color: var(--color-grey-700);
    background: linear-gradient(
      to top left,
      transparent 50%,
      var(--color-indigo-300) 0%
    );
  }

  .react-calendar-tile-blocked-left-start {
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to top left,
        transparent 50%,
        var(--color-grey-200) 0%
      ),
      linear-gradient(
        to bottom right,
        transparent 50%,
        var(--color-indigo-300) 0%
      );
  }

  .react-calendar-tile-blocked-right-end {
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to bottom right,
        transparent 50%,
        var(--color-grey-200) 0%
      ),
      linear-gradient(to top left, transparent 50%, var(--color-indigo-300) 0%);
  }
`;

export default StyledCalendar;
