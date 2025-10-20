import React, { useEffect, useState } from "react";
import {
  HotelBookingDetails,
  PassengerDetails,
} from "@/contexts/BookingContext";
import { validateField } from "@/app/validators/formValidators";
import BookingSummary from "./BookingSummary";
import { useToast } from "@/hooks/use-toast";
import { BookingApi } from "@/services/api/booking";
import { RecommendationAPI } from "@/services/api/recommendation";
import { useAuth } from "@/hooks/useAuth";
import ContactForm from "./ContactForm";
import ConsentSection from "./ConsentSection";
import CancellationPolicy from "./CancellationPolicy";
import SubscriptionInfo from "./SubscriptionInfo";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getUserSubscriptionStatus } from "@/services/api/subscription";
import { getSubscriptionPlans } from "@/services/api/subscription";
import { SubscriptionStatus } from "@/types/subscription";

interface HotelPaymentProps {
  hotelBookingDetails: HotelBookingDetails;
  passengerDetails: PassengerDetails;
  setIsLoading: (isLoading: boolean) => void;
}

const HotelPayment = ({
  hotelBookingDetails,
  passengerDetails,
  setIsLoading,
}: HotelPaymentProps) => {
  const { nationality } = useCurrency();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [useCredits, setUseCredits] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'annual' | null>(null);
  const { token, user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const { toast } = useToast();
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

  }, [subscriptionType, token]);

  const calculateTotal = () => {
    const includedTax = hotelBookingDetails.rooms[0].taxes?.taxes
      ? hotelBookingDetails.rooms[0].taxes.taxes
        .filter((tax) => tax.included)
        // @ts-ignore
        .reduce((sum, tax) => sum + parseFloat(tax.amount), 0)
      : 0;

    const excludedTax = hotelBookingDetails.rooms[0].taxes?.taxes
      ? hotelBookingDetails.rooms[0].taxes.taxes
        .filter((tax) => !tax.included)
        // @ts-ignore
        .reduce((sum, tax) => sum + parseFloat(tax.amount), 0)
      : 0;

    const travelCredit = useCredits ? -15 : 0;
    const exploredCredit = useCredits ? -10 : 0;
    let subtotal = subscriptionType !== null ? parseFloat(hotelBookingDetails.rooms[0].farePrice) : parseFloat(hotelBookingDetails.rooms[0].originalPrice);
    if (
      hotelBookingDetails.address.state === 'AU' ||
      hotelBookingDetails.address.state === 'au'
    ) {
      subtotal = subtotal * 1.1;
    }
    const total = parseFloat(subtotal.toFixed(2)) + (subscriptionType !== null && !subscriptionStatus?.is_active ? parseFloat(plan?.find((plan: any) => plan.type === subscriptionType)?.display_price || '0') : 0)
    return {
      includedTax,
      excludedTax,
      travelCredit,
      exploredCredit,
      itemPrice: subscriptionType !== null ? parseFloat(hotelBookingDetails.rooms[0].farePrice) : parseFloat(hotelBookingDetails.rooms[0].originalPrice),
      total: total,
      originalPrice: parseFloat(hotelBookingDetails.rooms[0].originalPrice),
      farePrice: parseFloat(hotelBookingDetails.rooms[0].farePrice),
    };
  };

  const prepareApiRequestBody = (formData: FormData) => {
    const assignRoomNumbers = (passengers: any, noOfRooms: number) => {
      const paxes = [];
      let passengersPerRoom = Math.ceil(passengers.length / noOfRooms);

      for (let i = 0; i < passengers.length; i++) {
        const passenger = passengers[i];
        const roomNumber = Math.floor(i / passengersPerRoom) + 1;

        paxes.push({
          room_no: roomNumber,
          type: passenger.age > 12 ? "AD" : "CH",
          age: passenger.age,
          name: passenger.firstName,
          surname: passenger.lastName,
        });
      }
      return paxes;
    };

    const paxes = assignRoomNumbers(
      passengerDetails.passengers,
      hotelBookingDetails.noOfRooms
    );

    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    return {
      request_id: hotelBookingDetails.requestId,
      hotel_id: hotelBookingDetails.hotelId,
      holder: {
        name: passengerDetails.holder.firstName,
        surname: passengerDetails.holder.lastName,
        email: email,
        phone_number: phone,
      },
      supplierReference: "HOTELBEDS",
      checkIn: hotelBookingDetails.checkIn,
      checkOut: hotelBookingDetails.checkOut,
      rooms: hotelBookingDetails.rooms.map((room) => ({
        roomId: room.roomId.toString(),
        rateId: room.rateId.toString(),
        paxes: paxes,
      })),
      nationality: hotelBookingDetails.nationality || nationality,
      subscription_type: subscriptionType,
      remark: hotelBookingDetails.remark,
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


    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormAction = async (formData: FormData) => {
    const validated = validateForm(formData);

    if (!validated) {
      toast({
        title: "Validation Error",
        description: "Please fill all the required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const requestBody = prepareApiRequestBody(formData);
      if (!requestBody) throw new Error("Failed to prepare request body");

      setIsLoading(true);
      // return;
      // Handle hotel booking preconfirmation
      const response = await BookingApi.hotelPreconfirmBooking(
        requestBody,
        token!
      );

      if (response.status === "PENDING" && response.payment?.checkout_url) {
        // Record the feedback before redirecting
        if (hotelBookingDetails) {
          let itemId = hotelBookingDetails.hotelId;
          RecommendationAPI.sendFeedback(
            Number(itemId),
            "hotel",
            "book",
            token!
          );
        }
        // Redirect to Stripe checkout
        window.location.href = response.payment.checkout_url;
        return;
      } else {
        throw new Error("Invalid response from hotel booking preconfirmation");
      }
    } catch (error: any) {
      console.error("Error in hotel booking:", error);
      toast({
        title: "Booking Error",
        description: error.message || "Failed to process hotel booking",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row justify-between gap-8">
      <div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleFormAction(formData);
          }}
          className="flex-1"
        >
          <div className="py-8 px-6 rounded-[20px] bg-background shadow-cardShadow gap-2">
            <CancellationPolicy
              cancellation={hotelBookingDetails.rooms[0]?.cancellationPolicy}
              amount={hotelBookingDetails.rooms[0].cancellationPolicy.amount}
              currency={hotelBookingDetails.currency}
            />
            <ContactForm
              errors={formErrors}
              firstName={passengerDetails.holder.firstName}
              lastName={passengerDetails.holder.lastName}
              email={user?.user?.email}
              phone={user?.phone_number || ""}
            />
          </div>
          <SubscriptionInfo
            plans={plan}
            subscriptionStatus={subscriptionStatus}
            currency={hotelBookingDetails.currency}
            originalPrice={hotelBookingDetails.rooms[0].originalPrice}
            farePrice={hotelBookingDetails.rooms[0].farePrice}
            setSubscriptionType={setSubscriptionType}
          />
          {/* <PaymentMethodForm errors={formErrors} bookingType="hotel" /> */}
          <ConsentSection />
          {formErrors.submit && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {formErrors.submit}
            </p>
          )}
        </form>
      </div>
      <div className="space-y-5 w-full lg:max-w-[30%]">
        <BookingSummary
          plans={plan}
          subscriptionStatus={subscriptionStatus}
          subscriptionType={subscriptionType}
          itemName={hotelBookingDetails.itemName}
          itemImage={hotelBookingDetails.itemImage}
          adults={hotelBookingDetails.noOfAdults}
          children={hotelBookingDetails.noOfChildren}
          checkIn={hotelBookingDetails.checkIn}
          checkOut={hotelBookingDetails.checkOut}
          price={calculateTotal()}
          currency={hotelBookingDetails.currency}
          nationality={hotelBookingDetails.address.state || ""}
        />


      </div>
    </div>
  );
};

export default HotelPayment;
