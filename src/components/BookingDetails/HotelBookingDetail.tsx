import { validateField } from "@/app/validators/formValidators";
import { isHotelBooking, useBooking } from "@/contexts/BookingContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FormInput, HolderInfoSection } from "./BookingDetailContent";
import NationalitySelector from "../NationalitySelector";
import { useAuth } from "@/contexts/AuthContext";

export const HotelBookingDetail = ({ type }: { type: string }) => {
    const { dispatch, state } = useBooking();
    const router = useRouter();
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<Record<string, string>>({});
    const { nationality } = useCurrency();
    const { user } = useAuth();



    // Handle input changes to persist data
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Pre-fill form data from state if available
    useEffect(() => {
        if (state.bookingDetails && isHotelBooking(state.bookingDetails)) {
            const initialData: Record<string, string> = {
                remarks: state.bookingDetails.remark || "",
                // Add any other pre-filled fields here
            };
            setFormData(initialData);
        }
    }, [state.bookingDetails]);


    const validateForm = (formData: FormData): boolean => {
        const errors: Record<string, string> = {};

        // Validate holder info
        const holderFirstName = formData.get("holderFirstName") as string;
        const holderLastName = formData.get("holderLastName") as string;

        const firstNameError = validateField("holderFirstName", holderFirstName);
        const lastNameError = validateField("holderLastName", holderLastName);

        if (firstNameError) errors.holderFirstName = firstNameError;
        if (lastNameError) errors.holderLastName = lastNameError;

        // Validate adult passengers
        Array.from({ length: state.bookingDetails?.noOfAdults || 0 }).forEach(
            (_, index) => {
                const passengerFirstName = formData.get(
                    `passenger${index}FirstName`
                ) as string;
                const passengerLastName = formData.get(
                    `passenger${index}LastName`
                ) as string;
                const passengerAge = formData.get(`passenger${index}Age`) as string;

                const firstNameError = validateField("firstName", passengerFirstName);
                const lastNameError = validateField("lastName", passengerLastName);
                const ageError = validateField("age", passengerAge);

                if (firstNameError)
                    errors[`passenger${index}FirstName`] = firstNameError;
                if (lastNameError) errors[`passenger${index}LastName`] = lastNameError;
                if (ageError) errors[`passenger${index}Age`] = ageError;
            }
        );

        // Validate child passengers
        if (
            state.bookingDetails?.noOfChildren &&
            isHotelBooking(state.bookingDetails)
        ) {
            getChildrenAges().forEach((_, index) => {
                const childFirstName = formData.get(`child${index}FirstName`) as string;
                const childLastName = formData.get(`child${index}LastName`) as string;

                const firstNameError = validateField("firstName", childFirstName);
                const lastNameError = validateField("lastName", childLastName);

                if (firstNameError) errors[`child${index}FirstName`] = firstNameError;
                if (lastNameError) errors[`child${index}LastName`] = lastNameError;
            });
        }

        // Validate remarks if provided (optional field)
        const remarks = formData.get("remarks") as string;
        if (remarks && remarks.length > 200) {
            errors.remarks = "Remarks cannot exceed 200 characters";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormAction = async (formData: FormData) => {
        if (!validateForm(formData)) {
            return;
        }

        if (isHotelBooking(state.bookingDetails)) {
            if (!state.bookingDetails.nationality && !nationality) {
                toast({
                    title: "Please select nationality",
                    variant: "destructive",
                });
                return;
            }
        }

        // Extract holder info
        const holder = {
            firstName: formData.get("holderFirstName") as string,
            lastName: formData.get("holderLastName") as string,
        };

        // Extract adult passengers
        const adultPassengers = Array.from(
            { length: state.bookingDetails?.noOfAdults || 0 },
            (_, index) => ({
                firstName: formData.get(`passenger${index}FirstName`) as string,
                lastName: formData.get(`passenger${index}LastName`) as string,
                age: parseInt(formData.get(`passenger${index}Age`) as string),
            })
        );

        // Extract child passengers
        const childPassengers = getChildrenAges().map((age, index) => ({
            firstName: formData.get(`child${index}FirstName`) as string,
            lastName: formData.get(`child${index}LastName`) as string,
            age: age,
        }));

        // Combine all passengers
        const passengers = [...adultPassengers, ...childPassengers];

        dispatch({
            type: "SET_PASSENGER_DETAILS",
            payload: {
                holder,
                passengers,
            },
        });

        router.push(`/payment/?type=${type}`);
    };



    const handleNationalityChange = (value: string) => {
        if (state.bookingDetails && isHotelBooking(state.bookingDetails)) {
            dispatch({
                type: "SET_HOTEL_BOOKING",
                payload: {
                    ...state.bookingDetails,
                    nationality: value,
                },
            });
        }
    };

    // Add type guard check for children section
    const getChildrenAges = () => {
        if (state.bookingDetails && isHotelBooking(state.bookingDetails)) {
            return state.bookingDetails.agesOfChildren || [];
        }
        return [];
    };

    return (
        <form action={handleFormAction}>
            <div className="px-4 md:px-8 lg:px-10 max-w-[800px] mx-auto py-16">
                <h1 className="text-3xl font-semibold text-foreground pb-8">
                    Booking Details
                </h1>

                <HolderInfoSection errors={formErrors} user={user} />

                {Array.from({ length: state.bookingDetails?.noOfAdults! }).map(
                    (_, index) => (
                        <PassengerSection
                            key={index}
                            index={index}
                            errors={formErrors}
                            firstName={index === 0 ? user?.first_name ?? '' : undefined}
                            lastName={index === 0 ? user?.last_name ?? '' : undefined}
                        />
                    )
                )}
                {getChildrenAges().map((age, index) => (
                    <ChildPassengerSection
                        title="Child"
                        key={index}
                        index={index}
                        age={age}
                        errors={formErrors}
                    />
                ))}

                <NationalitySelector
                    initialValue={nationality!}
                    onSelect={handleNationalityChange}
                    className="mt-6"
                />
                <FormInput
                    label="Special Request"
                    id="remarks"
                    name="remarks"
                    className="mt-6"
                    required={false}
                    error={formErrors.remarks}
                    value={formData.remarks || ""}
                    onChange={handleInputChange}
                    maxLength={500}
                />

                <Button
                    type="submit"
                    className="w-full mt-6 bg-primary-400 text-base font-medium hover:bg-primary-500 duration-300 text-background"
                >
                    Continue to Payment
                </Button>
            </div>
        </form>
    );
};

const ChildPassengerSection = ({
    index,
    age,
    errors,
    title,
}: {
    index: number;
    age: number;
    errors: Record<string, string>;
    title: string;
}) => (
    <div className="px-6 py-8 border border-gray-200 rounded-[20px] shadow-cardShadow my-6">
        <h2 className="text-xl font-semibold text-foreground pb-2">
            {title} {index + 1}
        </h2>
        <div className="space-y-6">
            <FormInput
                label="First Name"
                id={`child${index}FirstName`}
                name={`child${index}FirstName`}
                error={errors[`child${index}FirstName`]}
                minLength={2}
            />
            <FormInput
                label="Last Name"
                id={`child${index}LastName`}
                name={`child${index}LastName`}
                error={errors[`child${index}LastName`]}
                minLength={2}
            />
            <FormInput
                label="Age"
                id={`child${index}Age`}
                name={`child${index}Age`}
                type="number"
                value={age.toString()}
                disabled={true}
                error={errors[`child${index}Age`]}
            />
        </div>
    </div>
);
const PassengerSection = ({
    index,
    errors,
    firstName,
    lastName,
}: {
    index: number;
    errors: Record<string, string>;
    firstName?: string;
    lastName?: string;
}) => (
    <div className="px-6 py-8 border border-gray-200 rounded-[20px] shadow-cardShadow mt-6">
        <h2 className="text-xl font-semibold text-foreground pb-2">
            Guest {index + 1}
        </h2>
        <div className="space-y-6">
            <FormInput
                label="First Name"
                id={`passenger${index}FirstName`}
                name={`passenger${index}FirstName`}
                error={errors[`passenger${index}FirstName`]}
                minLength={2}
                defaultValue={firstName}
            />
            <FormInput
                label="Last Name"
                id={`passenger${index}LastName`}
                name={`passenger${index}LastName`}
                error={errors[`passenger${index}LastName`]}
                minLength={2}
                defaultValue={lastName}
            />
            <FormInput
                label="Age"
                id={`passenger${index}Age`}
                name={`passenger${index}Age`}
                type="number"
                error={errors[`passenger${index}Age`]}
                min={0}
                max={120}
            />
        </div>
    </div>
);