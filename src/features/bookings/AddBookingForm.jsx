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
import { addDays, format, formatDistanceStrict } from "date-fns";
import { useSettings } from "../settings/useSettings";

function AddBookingForm({ cabinToBook, onClose }) {
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  //maxBookingLength maxGuestsPerBooking minBookingLength
  const { settings } = useSettings();

  const { isLoading, dates } = useCabinBlockedDates(cabinToBook.id);
  const [datesSelected, setDatesSelected] = useState();
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

  const bookingLength = datesSelected
    ? +formatDistanceStrict(datesSelected[0], datesSelected[1], {
        unit: "day",
      }).split(" ")[0] - 1
    : 0;
  // console.log(errors?.endDate);

  // //TEST
  // useEffect(() => {
  //   console.log(`Dates on change: ${datesSelected}`);
  // }, [datesSelected]);

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

      {/* Guest name */}
      {/* Guest id/search existing user */}
      {/* Guest email/search existing user */}
      {/* Guest numbers */}

      {/* Breakfast included */}
      {/* Paid on booking*/}

      <FormRow label="Cabin name">
        {/* error={errors?.name?.message} */}
        <Input
          type="text"
          id="name"
          // disabled={isWorking}
          {...register("name")}
        />
      </FormRow>
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
