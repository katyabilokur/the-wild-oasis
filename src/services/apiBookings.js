import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings({ filter, sortBy, page }) {
  let query = supabase
    .from("bookings")
    .select("*,  cabins(name), guests(fullName, email)", { count: "exact" });

  //FILTER
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  //SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  //PAGINATION
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  if (page) {
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Bookings cannot be loaded");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

//Returns booked dates after today for certain canin
export async function getBookedFutureDatesForCabin(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("startDate, endDate")
    .gte("endDate", getToday({ end: true }))
    .eq("cabinId", id);

  if (error) {
    console.error(error);
    throw new Error("Booking details could not get loaded");
  }

  // console.log(data);
  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

//export async function createBooking(newBooking, newGuest) {
export async function createBooking(data) {
  let newGuestId = null;

  const newBooking = data.newBooking;
  const newGuest = data.newGuest;

  console.log(`newBooking: ${newBooking}`);
  console.log(`newGuest: ${newGuest}`);

  //1. Create a new guest if needed
  if (newGuest !== null) {
    const { data: dataGuest, error: errorGuest } = await supabase
      .from("guests")
      .insert([{ ...newGuest }])
      .select();

    if (errorGuest) {
      console.error(errorGuest);
      throw new Error("A new guest can not be created");
    }

    console.log(dataGuest);
    newGuestId = dataGuest[0].id;
  }

  //2. Create a new booking
  const { data: dataBooking, error: errorBooking } = await supabase
    .from("bookings")
    .insert([{ ...newBooking, guestId: newGuestId }])
    .select();

  if (errorBooking) {
    console.error(errorBooking);
    throw new Error("A new booking could not be created");
  }
  return dataBooking;
}

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
