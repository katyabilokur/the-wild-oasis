import {
  intervalToDuration,
  formatDistance,
  formatDistanceStrict,
  parseISO,
} from "date-fns";
import { differenceInDays } from "date-fns";
// import { differenceInDays, formatDistance, parseISO } from 'date-fns';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(new Date(dateStr), new Date().setHours(0, 0, 0, 0), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");
// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

export const createDateRange = (
  startDate,
  endDate,
  includeStart = false,
  existingDateRange = []
) => {
  const allDates = [...existingDateRange];

  const sDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  const eDate = addDaysToDate(
    new Date(new Date(endDate).setHours(0, 0, 0, 0)),
    includeStart ? 0 : -1
  );

  if (includeStart)
    allDates.push(new Date(new Date(startDate).setHours(0, 0, 0, 0)));

  while (sDate < eDate)
    allDates.push(new Date(sDate.setDate(sDate.getDate() + 1)));

  return allDates;
};

export const bookingLength = (dates) => {
  return dates
    ? +formatDistanceStrict(
        dates[0].setHours(0, 0, 0, 0),
        dates[1].setHours(0, 0, 0, 0),
        {
          unit: "day",
        }
      ).split(" ")[0]
    : 0;
};

export const blockedDatesInCalendar = (blockedDates) => {
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

export const addDaysToDate = (date, daysToAdd) => {
  let toAdd;
  toAdd = isNaN(daysToAdd) ? 0 : daysToAdd;

  let newDate = date;
  newDate.setHours(0, 0, 0, 0);
  newDate.setDate(newDate.getDate() + toAdd);
  return newDate;
};

export const isValidDate = (date) => {
  return Object.prototype.toString.call(date) === "[object Date]";
};
