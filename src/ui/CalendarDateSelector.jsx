import { createContext, useContext, useEffect, useState } from "react";
import { HiCalendar } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { createPortal } from "react-dom";
import { styled } from "styled-components";
import { Calendar as CalendarReact } from "react-calendar";
import { format, addDays, isEqual } from "date-fns";
import StyledCalendar from "./css/StyledCalendar";
import { useSettings } from "../features/settings/useSettings";

const createDateRange = (
  startDate,
  endDate,
  includeStart = false,
  existingDateRange = []
) => {
  const allDates = [...existingDateRange];

  const sDate = new Date(startDate);
  const eDate = addDays(new Date(endDate), includeStart ? -2 : -1);
  if (includeStart) allDates.push(new Date(startDate));

  while (sDate < eDate)
    allDates.push(new Date(sDate.setDate(sDate.getDate() + 1)));

  return allDates;
};

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

const StyledDate = styled.p``;

const CalendarDateContext = createContext();

function CalendarDateSelector({
  children,
  isLoading,
  blockedDates,
  onDateSelection,
  onIncludeBlockedDates,
}) {
  const { settings } = useSettings();
  const [calendarOpen, setCalendarOpen] = useState(false);
  // const [dates, setDates] = useState([new Date(), addDays(new Date(), 1)]);
  const [dates, setDates] = useState(() => {
    return [new Date(), addDays(new Date(), 1)];
  });
  const [position, setPosition] = useState(null);
  const close = () => setCalendarOpen((open) => !open);

  console.log(settings);

  useEffect(() => {
    onDateSelection(dates);
  }, [dates]);

  useEffect(() => {
    setDates([new Date(), addDays(new Date(), +settings.minBookingLength)]);
  }, [settings]);

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
        onIncludeBlockedDates,
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
    onIncludeBlockedDates,
  } = useContext(CalendarDateContext);

  const ref = useOutsideClick(close, false);

  const blockedDatesInCalendar = (blockedDates) => {
    let allBlockedDates = [];

    blockedDates.map((dateRange) => {
      allBlockedDates = createDateRange(
        dateRange.startDate,
        dateRange.endDate,
        false,
        allBlockedDates
      );
    });
    return allBlockedDates;
  };

  const allBlockedDates = blockedDatesInCalendar(blockedDates);

  const tileHalfBlockedClassAdd = ({ date }) => {
    if (
      blockedDates
        .map((block) => block.startDate)
        .some((day) => isEqual(day, date))
    ) {
      if (isEqual(date, dates[1].setHours(0, 0, 0, 0)))
        return "react-calendar-tile-blocked-right-end";

      return "react-calendar-tile-blocked-left";
    }
    if (
      blockedDates
        .map((block) => block.endDate)
        .some((day) => isEqual(day, date))
    ) {
      if (isEqual(date, dates[0].setHours(0, 0, 0, 0)))
        return "react-calendar-tile-blocked-left-start";

      return "react-calendar-tile-blocked-right";
    }
  };

  useEffect(() => {
    let overlapped = false;
    const allBookedDates = createDateRange(dates[0], dates[1], true);

    allBookedDates.map((bookedDay) => {
      allBlockedDates.some((blockedDay) => {
        if (isEqual(blockedDay, bookedDay)) {
          // console.log(
          //   `${isEqual(
          //     blockedDay,
          //     bookedDay
          //   )}: bookedDay: ${bookedDay} / blockedDate: ${blockedDay} (${blockedDay.getTime()} / ${blockedDay.getTime()})`
          // );
          overlapped = true;
        }
      });
    });
    return onIncludeBlockedDates(overlapped);
  }, [dates]);

  if (!calendarOpen) return null;

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
        tileClassName={tileHalfBlockedClassAdd}
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
