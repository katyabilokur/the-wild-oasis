import { createContext, useContext, useEffect, useState } from "react";
import { HiCalendar } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { createPortal } from "react-dom";
import { styled } from "styled-components";
import { Calendar as CalendarReact } from "react-calendar";
import { format, addDays, isEqual } from "date-fns";
import StyledCalendar from "./css/StyledCalendar";
import { useSettings } from "../features/settings/useSettings";
import { createDateRange } from "../utils/helpers";

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
  const [dates, setDates] = useState([new Date(), addDays(new Date(), 1)]);
  // const [dates, setDates] = useState(() => {
  //   return [new Date(), addDays(new Date(), 1)];
  // });

  const [position, setPosition] = useState(null);
  const [allBookedDates, setAllBookedDates] = useState(() =>
    createDateRange(dates[0], dates[1], true)
  );
  const close = () => setCalendarOpen((open) => !open);

  useEffect(() => {
    setDates([new Date(), addDays(new Date(), +settings?.minBookingLength)]);

    onDateSelection([
      new Date(),
      addDays(new Date(), +settings?.minBookingLength),
    ]);
  }, [settings]);

  useEffect(() => {
    setAllBookedDates(createDateRange(dates[0], dates[1], true));
  }, [dates]);

  useEffect(() => {
    onDateSelection(dates);
  }, [dates]);

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
    allBookedDates,
    onDateSelection,
    setAllBookedDates,
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
  //const allBookedDates = createDateRange(dates[0], dates[1], true);

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
    //TODO: refactor repeated code
    let overlapped = true;
    let i = 0;
    // console.log("Booked dates");
    console.log(allBookedDates);
    // console.log("Blocked");
    // console.log(allBlockedDates);

    //----
    //while (overlapped)
    while (i < 10) {
      overlapped = false;
      i++;
      console.log(i);
      console.log(allBookedDates);
      console.log(dates);

      allBookedDates.map((bookedDay) => {
        allBlockedDates.some((blockedDay) => {
          if (
            isEqual(
              blockedDay.setHours(0, 0, 0, 0),
              bookedDay.setHours(0, 0, 0, 0)
            )
          ) {
            overlapped = true;
            // console.log("Equal");
            // console.log(
            //   blockedDay.setHours(0, 0, 0, 0),
            //   bookedDay.setHours(0, 0, 0, 0)
            // );
          }
        });
      });
      // console.log(overlapped);

      console.log(overlapped);
      if (overlapped)
        setDates((dates) => [addDays(dates[0], 1), addDays(dates[1], 1)]);
    }
  }, []);

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
