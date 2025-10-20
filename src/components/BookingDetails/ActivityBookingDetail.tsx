import { useEffect } from "react";

import { isActivityBooking } from "@/contexts/BookingContext";

import { useBooking } from "@/contexts/BookingContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateField } from "@/app/validators/formValidators";
import { FormInput, HolderInfoSection } from "./BookingDetailContent";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
export const ActivityAdditionalInfo = () => {
    const { dispatch, state } = useBooking();
    const router = useRouter();
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const { user } = useAuth();

    // Move navigation logic to useEffect
    console.log(state.bookingDetails);

    useEffect(() => {
        if (!state.bookingDetails || !isActivityBooking(state.bookingDetails)) {
            router.push("/");
        }
    }, [state.bookingDetails, router]);

    // Example questions - in real app, these would come from API
    const questions = [
        { code: "PICKUP", text: "Do you need hotel pickup?" },
        { code: "DIETARY", text: "Any dietary requirements?" },
        { code: "MEDICAL", text: "Any medical conditions we should know about?" },
    ];

    const validateForm = (formData: FormData): boolean => {
        const errors: Record<string, string> = {};

        questions.forEach((q) => {
            const answer = formData.get(q.code);
            if (!answer) {
                errors[q.code] = "This field is required";
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormAction = async (formData: FormData) => {
        // Prevent default form submission behavior
        const form = document.querySelector("form");
        const submitEvent = new Event("submit", { cancelable: true });
        form?.dispatchEvent(submitEvent);

        const errors: Record<string, string> = {};
        const passengers = [];

        // Validate and collect passenger data
        if (!state.bookingDetails || !isActivityBooking(state.bookingDetails)) {
            return;
        }

        for (let index = 0; index < state.bookingDetails.paxes.length; index++) {
            const age = state.bookingDetails.paxes[index];
            const title = age >= 18 ? "Adult" : "Child";

            const passengerFirstName = formData.get(
                `${title}${index}FirstName`
            ) as string;
            const passengerLastName = formData.get(
                `${title}${index}LastName`
            ) as string;

            const firstNameError = validateField("firstName", passengerFirstName);
            const lastNameError = validateField("lastName", passengerLastName);

            if (firstNameError) errors[`${title}${index}FirstName`] = firstNameError;
            if (lastNameError) errors[`${title}${index}LastName`] = lastNameError;

            if (!firstNameError && !lastNameError) {
                passengers.push({
                    firstName: passengerFirstName,
                    lastName: passengerLastName,
                    age: age,
                    type: title.toUpperCase() as "ADULT" | "CHILD",
                });
            }
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Extract holder info
        const holder = {
            firstName: formData.get("holderFirstName") as string,
            lastName: formData.get("holderLastName") as string,
        };

        // Extract answers from form
        const answers = state.bookingDetails.questions.map((q) => {
            const answer = formData.get(q.code) as string;
            return {
                question: {
                    code: q.code,
                    text: q.text,
                },
                answer: answer,
            };
        });

        // Update the activity booking with answers while preserving all required fields
        dispatch({
            type: "SET_ACTIVITY_BOOKING",
            payload: {
                ...state.bookingDetails,
                answers: answers,
            },
        });

        // Update passenger details
        dispatch({
            type: "SET_PASSENGER_DETAILS",
            payload: {
                holder,
                passengers,
            },
        });

        router.push("/payment/?type=activity");
    };

    // Guard against invalid state in render
    if (!state.bookingDetails || !isActivityBooking(state.bookingDetails)) {
        return null;
    }

    return (
        <form action={handleFormAction}>
            <div className="px-4 md:px-8 lg:px-10 max-w-[800px] mx-auto py-16">
                <h1 className="text-3xl font-semibold text-foreground pb-8">
                    Activity Details
                </h1>

                <HolderInfoSection errors={formErrors} user={user} />

                {state.bookingDetails.paxes.map((age: number, index: number) => {
                    const title = age >= 18 ? "Adult" : "Child";
                    return (
                        <div
                            key={index}
                            className="px-6 py-8 border border-gray-200 rounded-[20px] shadow-cardShadow my-6"
                        >
                            <h2 className="text-xl font-semibold text-foreground pb-2">
                                {title}
                            </h2>
                            <div className="space-y-6">
                                <FormInput
                                    label="First Name"
                                    id={`${title}${index}FirstName`}
                                    name={`${title}${index}FirstName`}
                                    error={formErrors[`${title}${index}FirstName`]}
                                    defaultValue={index === 0 ? user?.first_name ?? '' : undefined}
                                    minLength={2}
                                />
                                <FormInput
                                    label="Last Name"
                                    id={`${title}${index}LastName`}
                                    name={`${title}${index}LastName`}
                                    error={formErrors[`${title}${index}LastName`]}
                                    defaultValue={index === 0 ? user?.last_name ?? '' : undefined}
                                    minLength={2}
                                />
                                <FormInput
                                    label="Age"
                                    id={`${title}${index}Age`}
                                    name={`${title}${index}Age`}
                                    type="number"
                                    value={age.toString()}
                                    disabled={true}
                                    error={formErrors[`${title}${index}Age`]}
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Activity Questions Section */}
                <div className="px-6 py-8 border border-gray-200 rounded-[20px] shadow-cardShadow mt-6">
                    <h2 className="text-xl font-semibold text-foreground pb-4">
                        Additional Information
                    </h2>
                    <div className="space-y-6">
                        {state.bookingDetails.questions.map(
                            (q: { code: string; text: string; required: boolean }) => (
                                <div key={q.code}>
                                    <Label
                                        htmlFor={q.code}
                                        className="text-base font-medium text-gray-800"
                                    >
                                        {q.text}{" "}
                                        {q.required ? <span className="text-red-500">*</span> : ""}
                                    </Label>
                                    <Input
                                        id={q.code}
                                        name={q.code}
                                        className={`w-full mt-2 ${formErrors[q.code] ? "border-red-500" : ""
                                            }`}
                                        required={q.required}
                                    />
                                    {formErrors[q.code] && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formErrors[q.code]}
                                        </p>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>

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