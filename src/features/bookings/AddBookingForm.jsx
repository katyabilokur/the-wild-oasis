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

function AddBookingForm({ cabinToBook, onClose }) {
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const { isLoading, dates } = useCabinBlockedDates(cabinToBook.id);

  function onSubmit({ dates }) {
    console.log(dates);
  }

  if (isLoading) return <Spinner />;
  console.log(dates);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowHeader name={cabinToBook.name} img={cabinToBook.image} />
      {/* Start date - end date */}
      <FormRow label="Booking dates">
        <CalendarDateSelector isLoading={isLoading} blockedDates={dates}>
          <CalendarDateSelector.ToggleField />
          <Modal>
            <CalendarDateSelector.Calendar />
          </Modal>
        </CalendarDateSelector>
      </FormRow>

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
          // {...register("name", { required: "This field is required" })}
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
