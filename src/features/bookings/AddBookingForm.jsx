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
import { getNames, getCode } from "country-list";
import Checkbox from "../../ui/Checkbox";
import CheckboxPanel from "../../ui/CheckboxPanel";
import Textarea from "../../ui/Textarea";
import { useCreateBooking } from "./useCreateBooking";
import { useNavigate } from "react-router-dom";

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

  const { isCreating, createBooking } = useCreateBooking();
  const navigate = useNavigate();

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

  function onSubmit(data) {
    //1a. Check if using searched guest, use its id.
    let newGuest = null;

    if (searchedGuest === null) {
      //1b. Create a new guest record
      newGuest = {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        nationality: data.nationality.trim(),
        nationalID: data.nationalID.trim(),
        countryFlag: `https://flagcdn.com/${getCode(
          data.nationality
        ).toLowerCase()}.svg`,
      };
    }

    //2. Form newData object
    const cabinPrice =
      (cabinToBook.regularPrice - cabinToBook.discount) * bookingLength;
    const extrasPrice = data.hasBreakfast
      ? settings.breakfastPrice * bookingLength
      : 0;

    const newBooking = {
      startDate: data.startDate,
      endDate: data.endDate,
      numGuests: +data.numGuests,
      numNights: bookingLength,
      status: "unconfirmed",
      cabinPrice,
      extrasPrice,
      totalPrice: cabinPrice + extrasPrice,
      hasBreakfast: data.hasBreakfast,
      isPaid: data.isPaid,
      observations: data.observations,
      guestId: searchedGuest?.id,
      cabinId: cabinToBook.id,
    };

    //3. Create a new booking record
    createBooking(
      { newBooking, newGuest },
      {
        onSuccess: (data) => {
          if (data === "User exists") {
            toast(
              "A user with provided email or ID exists, please use Search to fill the details"
            );
          } else {
            toast.success("New booking is successfully added");
            reset();
            onClose?.();
            navigate(`/bookings/${data[0].id}`);
          }
        },
      }
    );
  }

  if (isLoading || isCreating) return <Spinner />;

  return (
    <Form type="modal" onSubmit={handleSubmit(onSubmit)}>
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
          readOnly={searchedGuest !== null || isLoadingGuest}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="text"
          id="email"
          readOnly={searchedGuest !== null || isLoadingGuest}
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
          readOnly={searchedGuest !== null || isLoadingGuest}
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
          readOnly={searchedGuest !== null || isLoadingGuest}
          {...register("nationality", { required: "This field is required" })}
        ></Select>
      </FormRow>

      {/* Guest numbers */}
      <FormRow label="Guest numbers" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          min="1"
          max={settings && +settings.maxGuestsPerBooking}
          {...register("numGuests", {
            required: "This field is required",
            validate: (value) =>
              +value <= +cabinToBook.maxCapacity ||
              `Maximum guest capacity is ${cabinToBook.maxCapacity}`,
          })}
        />
      </FormRow>
      <FormRow label="Notes" error={errors?.observations?.message}>
        <Textarea rows="4" id="observations" {...register("observations")} />
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
        <Button $variation="secondary" type="reset" onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button
          $variation="light"
          disabled={!searchedGuest}
          onClick={() => {
            setSearchedGuest(null), setSearchValue("");
          }}
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
