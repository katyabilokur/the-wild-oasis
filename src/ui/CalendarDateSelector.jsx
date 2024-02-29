import { createContext, useContext, useEffect, useState } from "react";
import { HiCalendar } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { createPortal } from "react-dom";
import { styled } from "styled-components";
import { Calendar as CalendarReact } from "react-calendar";
import { format, isEqual } from "date-fns";
import StyledCalendar from "./css/StyledCalendar";
import { useSettings } from "../features/settings/useSettings";
import {
  addDaysToDate,
  blockedDatesInCalendar,
  createDateRange,
} from "../utils/helpers";
import Spinner from "./Spinner";

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

const StyledCalendarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDate = styled.p``;

//----------------

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
  const [dates, setDates] = useState([
    new Date(),
    addDaysToDate(new Date(), 1),
  ]);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);

  const [position, setPosition] = useState(null);
  const [allBookedDates, setAllBookedDates] = useState(() =>
    createDateRange(dates[0], dates[1], true)
  );
  const [allBlockedDates, setAllBlockedDates] = useState(() =>
    blockedDatesInCalendar(blockedDates)
  );
  const close = () => setCalendarOpen((open) => !open);

  //In case someone else is booking this cabin at the same time, blocked dates will be updated
  useEffect(() => {
    setAllBlockedDates(blockedDatesInCalendar(blockedDates));
  }, [blockedDates]);

  useEffect(() => {
    setIsLoadingCalendar(true);
    setDates([
      new Date(),
      addDaysToDate(new Date(), +settings?.minBookingLength),
    ]);

    onDateSelection([
      new Date(),
      addDaysToDate(new Date(), +settings?.minBookingLength),
    ]);
    setIsLoadingCalendar(false);
  }, [settings]);

  useEffect(() => {
    setAllBookedDates(createDateRange(dates[0], dates[1], true));
  }, [dates]);

  useEffect(() => {
    onDateSelection(dates);
  }, [dates]);

  //Making sure dates selected by default are not blocked. Otherwise selecting new valid dates
  useEffect(() => {
    setIsLoadingCalendar(true);
    let currentDates = [
      new Date(),
      addDaysToDate(new Date(), +settings?.minBookingLength),
    ];
    let currentlyBookedDates = createDateRange(
      currentDates[0],
      currentDates[1],
      true
    );

    let overlapped = true;

    while (overlapped) {
      overlapped = false;

      currentlyBookedDates.map((bookedDay) => {
        allBlockedDates.some((blockedDay) => {
          if (
            isEqual(
              blockedDay.setHours(0, 0, 0, 0),
              bookedDay.setHours(0, 0, 0, 0)
            )
          ) {
            overlapped = true;
          }
        });
      });

      if (overlapped) {
        currentDates = [
          addDaysToDate(currentDates[0], 1),
          addDaysToDate(currentDates[1], 1),
        ];
        currentlyBookedDates = createDateRange(
          currentDates[0],
          currentDates[1],
          true
        );
      }
    }

    setDates(currentDates);
    setAllBookedDates(currentlyBookedDates);
    setIsLoadingCalendar(false);
  }, [settings]);

  if (isLoadingCalendar) return <Spinner />;

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
        allBookedDates,
        setAllBookedDates,
        allBlockedDates,
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
  console.log(dates);

  return (
    <>
      <StyledToggleField disabled={isLoading} onClick={handleCalendarOpen}>
        <StyledCalendarDiv>
          <HiCalendar />
        </StyledCalendarDiv>
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
    allBookedDates,
    onDateSelection,
    setAllBookedDates,
    allBlockedDates,
  } = useContext(CalendarDateContext);

  const ref = useOutsideClick(close, false);

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

    allBookedDates.map((bookedDay) => {
      allBlockedDates.some((blockedDay) => {
        if (isEqual(blockedDay, bookedDay)) {
          overlapped = true;
        }
      });
    });
    return onIncludeBlockedDates(overlapped);
  }, [dates]);

  if (!calendarOpen) return null;

  const handleBookedDates = (value) => {
    setAllBookedDates(createDateRange(value[0], value[1], true));
  };

  return createPortal(
    <StyledCalendar position={position} ref={ref}>
      <CalendarReact
        minDetail="month"
        onChange={(value) => {
          setDates(value);
          handleBookedDates(value);
          setCalendarOpen(false);
        }}
        value={dates}
        selectRange={true}
        tileClassName={tileHalfBlockedClassAdd}
        tileDisabled={({ date }) =>
          date < addDaysToDate(new Date(), -1) ||
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
