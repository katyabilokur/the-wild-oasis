import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import FormRowHeader from "../../ui/FormRowHeader";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import "react-calendar/dist/Calendar.css";
import CalendarDateSelector from "../../ui/CalendarDateSelector";
import Modal from "../../ui/Modal";
import { useCabinBlockedDates } from "../cabins/useCabinBlockedDates";
import Spinner from "../../ui/Spinner";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSettings } from "../settings/useSettings";
import { bookingLength as bookingLengthDays } from "../../utils/helpers";
import { HiOutlineDocumentSearch, HiOutlineSearch } from "react-icons/hi";
import { useGuest } from "../guests/useGuest";
import { toast } from "react-hot-toast";
import { getNames } from "country-list";
import Checkbox from "../../ui/Checkbox";
import CheckboxPanel from "../../ui/CheckboxPanel";
import InputArea from "../../ui/InputArea";

function AddBookingForm({ cabinToBook, onClose }) {
  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;

  //FOR DATES
  const { settings } = useSettings();

  const { isLoading, dates } = useCabinBlockedDates(cabinToBook.id);
  const [datesSelected, setDatesSelected] = useState();
  const [bookingLength, setBookingLength] = useState(() =>
    bookingLengthDays(datesSelected)
  );
  const [includeBlockedDates, setIncludeBlockedDates] = useState(false);

  //FOR USER SERACH
  const [searchValue, setSearchValue] = useState("");
  const [searchedGuest, setSearchedGuest] = useState(null);

  const countries = getNames();
  const {
    searchGuest,
    guest,
    isLoading: isLoadingGuest,
  } = useGuest(searchValue);

  function handleDateSelection(dates) {
    setDatesSelected(dates);
  }

  function hanleIncludeBlockedDates(include) {
    setIncludeBlockedDates(include);
  }

  function handleSearch(e) {
    e.preventDefault();
    searchGuest(searchValue);
    setSearchedGuest(guest);

    console.log(guest);

    if (guest) toast.success("Existing guest was found");
    if (!guest)
      toast.error(
        `No guest with '${searchValue}' email or ID has been found. Please add new guest details.`
      );
  }

  useEffect(() => {
    reset({
      fullName: searchedGuest ? searchedGuest.fullName : "",
      email: searchedGuest ? searchedGuest.email : "",
      nationalID: searchedGuest ? searchedGuest.nationalID : "",
      nationality: searchedGuest ? searchedGuest.nationality : "",
    });
  }, [searchedGuest]);

  useEffect(() => {
    reset({ startDate: datesSelected?.[0], endDate: datesSelected?.[1] });
  }, [datesSelected]);

  useEffect(() => {
    setBookingLength(bookingLengthDays(datesSelected));
  }, [datesSelected]);

  // //TEST
  // useEffect(() => {
  //   console.log(`Dates selected: ${datesSelected}`);
  // }, [datesSelected]);
  // useEffect(() => {
  //   console.log(`Lenght:  ${bookingLength}`);
  // }, [bookingLength]);

  function onSubmit({
    startDate,
    endDate,
    fullName,
    email,
    nationalID,
    nationality,
    numGuests,
    hasBreakfast,
    isPaid,
    onservations,
  }) {
    console.log(`START date: ${startDate}`);
    console.log(`END date: ${endDate}`);
    console.log(fullName);
    console.log(email);
    console.log(nationalID);
    console.log(nationality);
    console.log(numGuests);
    console.log(hasBreakfast);
    console.log(isPaid);
    console.log(onservations);
    //status = pending
  }

  if (isLoading) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowHeader name={cabinToBook.name} img={cabinToBook.image} />
      {/* Start date - end date */}
      <FormRow label="Booking dates" error={errors?.endDate?.message}>
        <CalendarDateSelector
          onDateSelection={handleDateSelection}
          onIncludeBlockedDates={hanleIncludeBlockedDates}
          isLoading={isLoading}
          blockedDates={dates}
        >
          <CalendarDateSelector.ToggleField />
          <Modal>
            <CalendarDateSelector.Calendar />
          </Modal>
        </CalendarDateSelector>
      </FormRow>
      <input
        id="startDate"
        type="hidden"
        {...register("startDate", { value: datesSelected?.[0] })}
      />
      <input
        id="endDate"
        type="hidden"
        {...register("endDate", {
          value: datesSelected?.[1],

          validate: {
            minNights: () =>
              bookingLength >= settings.minBookingLength ||
              `Minimum booking length should be at least ${settings.minBookingLength} nights`,
            maxNights: () =>
              bookingLength <= settings.maxBookingLength ||
              `Maximum booking length should be no more than ${settings.maxBookingLength} nights`,
            noBlockedDates: () =>
              !includeBlockedDates ||
              "Some of the selected dates include already booked dates. Please reselect",
          },
        })}
      />

      <FormRow
        label="Search user by email or ID"
        icon={<HiOutlineDocumentSearch />}
        button={{
          icon: <HiOutlineSearch />,
          onButtonClick: handleSearch,
          disabled: searchValue === "",
        }}
      >
        <Input
          type="text"
          id="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </FormRow>
      <FormRow label="Main guest full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={searchedGuest !== null || isLoadingGuest}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="text"
          id="email"
          disabled={searchedGuest !== null || isLoadingGuest}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>
      <FormRow label="National ID/Passport" error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={searchedGuest !== null || isLoadingGuest}
          {...register("nationalID", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Select
          options={countries}
          instruction="Select country"
          id="nationality"
          //  onChange={(e) => reset({ nationality: e.target.value })}
          value={countries.find((country) =>
            country.includes(searchedGuest?.nationality)
          )}
          disabled={searchedGuest !== null || isLoadingGuest}
          {...register("nationality", { required: "This field is required" })}
        ></Select>
      </FormRow>

      {/* Guest numbers */}
      <FormRow label="Guest numbers" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          min="1"
          max={+settings?.maxGuestsPerBooking}
          {...register("numGuests", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Notes" error={errors?.onservations?.message}>
        <InputArea rows="4" id="onservations" {...register("onservations")} />
      </FormRow>
      <CheckboxPanel>
        <Checkbox id="hasBreakfast" {...register("hasBreakfast")}>
          Breakfast included
        </Checkbox>
        <Checkbox id="isPaid" {...register("isPaid")}>
          Paid
        </Checkbox>
      </CheckboxPanel>

      <FormRow>
        <Button variation="secondary" type="reset" onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button
          variation="light"
          disabled={!searchedGuest}
          onClick={() => setSearchedGuest(null)}
        >
          Clear guest
        </Button>
        <Button disabled={isLoadingGuest}>
          {isLoadingGuest ? "Loading data..." : "Save booking"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default AddBookingForm;
