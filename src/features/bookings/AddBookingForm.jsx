import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import FormRowHeader from "../../ui/FormRowHeader";
import Input from "../../ui/Input";
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

function AddBookingForm({ cabinToBook, onClose }) {
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  //maxBookingLength maxGuestsPerBooking minBookingLength
  const { settings } = useSettings();

  const { isLoading, dates } = useCabinBlockedDates(cabinToBook.id);
  const [datesSelected, setDatesSelected] = useState();
  const [bookingLength, setBookingLength] = useState(() =>
    bookingLengthDays(datesSelected)
  );
  const [includeBlockedDates, setIncludeBlockedDates] = useState(false);

  function handleDateSelection(dates) {
    setDatesSelected(dates);
  }

  function hanleIncludeBlockedDates(include) {
    setIncludeBlockedDates(include);
  }

  useEffect(() => {
    reset({ startDate: datesSelected?.[0], endDate: datesSelected?.[1] });
  }, [datesSelected]);

  useEffect(() => {
    //  console.log(`datesSelected: ${datesSelected}`);
    setBookingLength(bookingLengthDays(datesSelected));
  }, [datesSelected]);

  // //TEST
  // useEffect(() => {
  //   console.log(`Dates selected: ${datesSelected}`);
  // }, [datesSelected]);
  // useEffect(() => {
  //   console.log(`Lenght:  ${bookingLength}`);
  // }, [bookingLength]);

  function onSubmit({ startDate, endDate, name }) {
    console.log(`START date: ${startDate}`);
    console.log(`END date: ${endDate}`);
    console.log(name);
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

      {/* <div> */}
      <FormRow
        label="Search user by email or ID"
        icon={<HiOutlineDocumentSearch />}
        button={<HiOutlineSearch />}
      >
        <Input type="text" id="search" />
      </FormRow>
      <FormRow label="Main guest full name">
        {/* error={errors?.name?.message} */}
        <Input
          type="text"
          id="name"
          // disabled={isWorking}
          {...register("name")}
        />
      </FormRow>
      <FormRow label="Email">
        {/* error={errors?.name?.message} */}
        <Input
          type="text"
          id="email"
          // disabled={isWorking}
          {...register("email")}
        />
      </FormRow>
      <FormRow label="Passport">
        {/* error={errors?.name?.message} */}
        <Input
          type="text"
          id="passport"
          // disabled={isWorking}
          {...register("passport")}
        />
      </FormRow>
      <FormRow label="Nationality">
        {/* error={errors?.name?.message} */}
        <Input
          type="text"
          id="nationality"
          // disabled={isWorking}
          {...register("nationality")}
        />
      </FormRow>

      {/* </div> */}
      {/* Guest name */}
      {/* Guest id/search existing user */}
      {/* Guest email/search existing user */}
      {/* Guest numbers */}
      {/* Breakfast included */}
      {/* Paid on booking*/}
      <FormRow>
        <Button variation="secondary" type="reset" onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button>
          Save booking
          {/* {isEditSession ? "Creating booking..." : "Save booking"} */}
        </Button>
      </FormRow>
    </Form>
  );
}

export default AddBookingForm;
