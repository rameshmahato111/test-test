import React, { useEffect, useState } from "react";
import ConsentSection from "./ConsentSection";
import ContactForm from "./ContactForm";
import DateSelector from "./DateSelector";
import {
  ActivityBookingDetails,
  PassengerDetails,
} from "@/contexts/BookingContext";
import { validateField } from "@/app/validators/formValidators";
import BookingSummary from "./BookingSummary";
import { toast } from "@/hooks/use-toast";
import { BookingApi } from "@/services/api/booking";
import { RecommendationAPI } from "@/services/api/recommendation";
import { useAuth } from "@/hooks/useAuth";
import SubscriptionInfo from "./SubscriptionInfo";
import { getSubscriptionPlans, getUserSubscriptionStatus } from "@/services/api/subscription";
import { SubscriptionStatus } from "@/types/subscription";

interface ActivityPaymentProps {
  activityBookingDetails: ActivityBookingDetails;
  passengerDetails: PassengerDetails;
  setIsLoading: (loading: boolean) => void;
}

const ActivityPayment = ({
  activityBookingDetails,
  passengerDetails,
  setIsLoading,
}: ActivityPaymentProps) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'annual' | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [selectedDate, setSelectedDate] = useState({
    from: activityBookingDetails.rateDetails[0].operationDates[0].from,
    to: activityBookingDetails.rateDetails[0].operationDates[0].to,
    rateDetailId: activityBookingDetails.rateDetails[0].id,
    cancellationPolicy:
      activityBookingDetails.rateDetails[0].operationDates[0]
        .cancellationPolicies,
  });
  const { token, user } = useAuth();
  const [plan, setPlan] = useState<any>(null);


  useEffect(() => {

    async function fetchData() {
      const [statusRes, res] = await Promise.all([
        getUserSubscriptionStatus(token || ''),
        getSubscriptionPlans(token || '')
      ]);
      const status = statusRes as SubscriptionStatus;
      // Set subscription status
      setSubscriptionStatus(status);
      setPlan(res);
    }
    fetchData();

  }, [subscriptionType]);

  const prepareApiRequestBody = (formData: FormData) => {
    const paxes = passengerDetails.passengers.map((passenger) => {
      return {
        name: passenger.firstName,
        type: passenger.age >= 18 ? "ADULT" : "CHILD",
        surname: passenger.lastName,
        age: passenger.age,
      };
    });
    return {
      holder: {
        name: formData.get("firstName") as string,
        email: formData.get("email") as string,
        surname: formData.get("lastName") as string,
        telephone: [formData.get("phone") as string],
      },
      activities: [
        {
          request_id: activityBookingDetails.requestId,
          activity_id: activityBookingDetails.activityId,
          modality_id: activityBookingDetails.modalityId,
          rate_id: activityBookingDetails.rateId,
          rate_detail_id: selectedDate.rateDetailId,
          from_: selectedDate.from,
          to: selectedDate.to,
          paxes: paxes,
          answers: activityBookingDetails.answers || []
        },
      ],
      subscription_type: subscriptionType,
    };
  };
  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};

    // Validate contact details
    ["firstName", "lastName", "email", "phone"].forEach((field) => {
      const value = formData.get(field) as string;
      const error = validateField(field, value);
      if (error) errors[field] = error;
    });

    // Validate activity date selection
    if (!selectedDate.rateDetailId) {
      errors.rateDetailId = "Please select a date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormAction = async (formData: FormData) => {
    if (!validateForm(formData)) {
      toast({
        title: "Validation Error",
        description: "Please fill all the required fields correctly.",
        variant: "error",
      });
      return;
    }

    try {
      const requestBody = prepareApiRequestBody(formData);

      if (!requestBody) throw new Error("Failed to prepare request body");
      setIsLoading(true);

      // Handle activity booking
      const response = await BookingApi.activityConfirmBooking(
        requestBody,
        token!
      );
      // return;

      if (response.status === "PENDING" && response.payment?.checkout_url) {
        // Record the feedback before redirecting
        if (activityBookingDetails) {
          let itemId = activityBookingDetails.activityId;
          RecommendationAPI.sendFeedback(
            Number(itemId),
            "activity",
            "book",
            token!
          );
        }
        // Redirect to Stripe checkout
        window.location.href = response.payment.checkout_url;
        return;
      } else {
        throw new Error("Invalid response from activity booking");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    const selectedRate = activityBookingDetails.rateDetails.find(
      (rate) => rate.id === selectedDate.rateDetailId
    );

    let subtotal = subscriptionType !== null ? parseFloat(selectedRate?.totalAmount.farePrice.toString()!) : parseFloat(selectedRate?.totalAmount.originalPrice.toString()!);
    if (
      activityBookingDetails.address.code === 'AU' ||
      activityBookingDetails.address.code === 'au'
    ) {
      subtotal = subtotal * 1.1;
    }

    const total = parseFloat(subtotal.toFixed(2)) + (subscriptionType !== null && !subscriptionStatus?.is_active ? parseFloat(plan?.find((plan: any) => plan.type === subscriptionType)?.display_price || '0') : 0);
    return {
      total,
      // @ts-ignore
      itemPrice: subscriptionType !== null ? parseFloat(selectedRate?.totalAmount.farePrice.toString()!) : parseFloat(selectedRate?.totalAmount.originalPrice.toString()!),
      tax: 0,
      travelCredit: 0,
      exploredCredit: 0,
      includedTax: 0,
      excludedTax: 0,
    };
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleFormAction(formData);
          }}
          className="flex-1"
        >
          <div className="py-8 px-6 rounded-[20px] bg-background shadow-cardShadow">
            <DateSelector
              rateDetails={activityBookingDetails.rateDetails}
              selectedDate={selectedDate}
              onDateSelect={(startDate, endDate, rateDetailId, policy) => {
                setSelectedDate({
                  from: startDate,
                  to: endDate,
                  rateDetailId,
                  cancellationPolicy: policy,
                });
              }}
            />
            <hr className="mb-4" />
            <ContactForm

              errors={formErrors}
              firstName={passengerDetails!.holder.firstName}
              lastName={passengerDetails!.holder.lastName}
              email={user?.user.email}
              phone={user?.phone_number || ""}
            />
          </div>

          <SubscriptionInfo
            currency={activityBookingDetails.currency}
            originalPrice={activityBookingDetails.rateDetails[0].totalAmount.originalPrice.toString()}
            farePrice={activityBookingDetails.rateDetails[0].totalAmount.farePrice.toString()}
            setSubscriptionType={setSubscriptionType}
            plans={plan}
            subscriptionStatus={subscriptionStatus}
          />
          <ConsentSection />
          {formErrors.submit && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {formErrors.submit}
            </p>
          )}
        </form>
        <div className="space-y-5 lg:max-w-[30%]">
          <BookingSummary
            subscriptionStatus={subscriptionStatus}
            itemName={activityBookingDetails.itemName}
            itemImage={activityBookingDetails.itemImage}
            adults={activityBookingDetails.noOfAdults}
            children={activityBookingDetails.noOfChildren}
            checkIn={selectedDate.from}
            checkOut={selectedDate.to}
            price={calculateTotal()}
            currency={activityBookingDetails.currency}
            plans={plan}
            subscriptionType={subscriptionType}
            nationality={activityBookingDetails.address.code || ""}
          />


        </div>
      </div>
    </>
  );
};
export default ActivityPayment;
