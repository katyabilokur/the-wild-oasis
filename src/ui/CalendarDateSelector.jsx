import { createContext, useContext, useState } from "react";
import { HiCalendar } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { createPortal } from "react-dom";
import { styled } from "styled-components";
import { Calendar as CalendarReact } from "react-calendar";
import { format, addDays, isEqual } from "date-fns";

const StyledToggleField = styled.div`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  border-radius: 5px;
  padding: 0.8rem 1.2rem;
  width: 30rem;

  display: flex;
  gap: 1rem;

  cursor: pointer;
`;

const StyledSvg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
    background: var(--color-indigo-700);
    color: white;
  }

  .react-calendar__tile--active {
    background: var(--color-indigo-700);
    color: white;
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
`;

const StyledDate = styled.p``;

const CalendarDateContext = createContext();

function CalendarDateSelector({ children, isLoading, blockedDates }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dates, setDates] = useState([new Date(), addDays(new Date(), 1)]);
  const [position, setPosition] = useState(null);
  const close = () => setCalendarOpen((open) => !open);

  return (
    <CalendarDateContext.Provider
      value={{
        setCalendarOpen,
        dates,
        setDates,
        calendarOpen,
        close,
        position,
        setPosition,
        isLoading,
        blockedDates,
      }}
    >
      {children}
    </CalendarDateContext.Provider>
  );
}

function ToggleField() {
  const { setPosition, dates, setCalendarOpen, isLoading } =
    useContext(CalendarDateContext);

  function handleCalendarOpen(e) {
    e.stopPropagation();

    const rect = e.target.closest("div").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 2,
    });

    setCalendarOpen((open) => !open);
  }

  return (
    <>
      {/* error={errors?.name?.message} */}
      <StyledToggleField
        // type="text"
        // id="dates"

        // {...register("name", { required: "This field is required" })}
        disabled={isLoading}
        onClick={handleCalendarOpen}
      >
        <StyledSvg>
          <HiCalendar />
        </StyledSvg>
        <StyledDate>{format(dates[0], "dd MMM")}</StyledDate>
        &mdash;
        <StyledDate>{format(dates[1], "dd MMM")}</StyledDate>
      </StyledToggleField>
    </>
  );
}

function Calendar() {
  const {
    dates,
    setDates,
    calendarOpen,
    position,
    close,
    setCalendarOpen,
    blockedDates,
  } = useContext(CalendarDateContext);

  const ref = useOutsideClick(close, false);

  if (!calendarOpen) return null;

  const blockedDatesInCalendar = (blockedDates) => {
    const allBlockedDates = [];
    blockedDates.map((dateRange) => {
      const startDate = new Date(dateRange.startDate);
      const endDate = addDays(new Date(dateRange.endDate), -1);

      allBlockedDates.push(new Date(startDate));

      while (startDate < endDate)
        allBlockedDates.push(
          //addDays(startDate, 1)
          new Date(startDate.setDate(startDate.getDate() + 1))
        );
    });
    return allBlockedDates;
  };

  const allBlockedDates = blockedDatesInCalendar(blockedDates);

  return createPortal(
    <StyledCalendar position={position} ref={ref}>
      <CalendarReact
        minDetail="month"
        onChange={(value) => {
          setDates(value);
          setCalendarOpen(false);
        }}
        value={dates}
        selectRange={true}
        tileDisabled={({ date }) =>
          date < addDays(new Date(), -1) ||
          allBlockedDates.some((day) => isEqual(day, date))
        }
      />
    </StyledCalendar>,
    document.body
  );
}

CalendarDateSelector.ToggleField = ToggleField;
CalendarDateSelector.Calendar = Calendar;

export default CalendarDateSelector;
