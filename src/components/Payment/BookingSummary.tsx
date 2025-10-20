import React from "react";
import Image from "next/image";
import { Activity } from "lucide-react";
import { formatNumberWithCommas } from "@/utils";
import { SubscriptionStatus } from "@/types/subscription";

interface BookingSummaryProps {
  itemName: string;
  itemImage: string;
  adults: number;
  children: number;
  checkIn?: string;
  checkOut?: string;
  price: {
    itemPrice: number;
    includedTax: number;
    excludedTax: number;
    travelCredit: number;
    exploredCredit: number;
    total: number;
  };
  currency: string;
  nationality?: string;
  plans: any;
  subscriptionType: string | null;
  subscriptionStatus: SubscriptionStatus | null;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  itemName,
  itemImage,
  adults,
  children,
  checkIn,
  checkOut,
  price,
  currency,
  nationality,
  plans,
  subscriptionType,
  subscriptionStatus

}) => {
  return (
    <div className="px-4 py-6 min-w-[350px] rounded-lg bg-background shadow-cardShadow">
      <div className="flex items-start gap-3 border-b pb-4">
        {itemImage ? (
          <Image
            src={`${itemImage}`}
            className="rounded-md object-cover"
            alt={itemName}
            width={80}
            height={100}
            unoptimized
          />
        ) : (
          <div className="w-14 h-14 bg-primary-100 rounded-md flex items-center justify-center">
            <Activity className="w-8 h-8 text-primary-300" />
          </div>
        )}
        <h1 className="text-foreground text-base xl:text-xl font-semibold capitalize">
          {itemName}
        </h1>
      </div>

      <div className="py-4 space-y-3 pb-6">
        {[
          {
            label: "No of People",
            value: `${adults} Adults, ${children} Children`,
          },
          { label: "Date", value: `${checkIn} - ${checkOut}` },
          {
            label: "Item Price",
            value: `${formatNumberWithCommas(
              price.itemPrice || 0
            )} ${currency}`,
          },
          {
            label: "Included Taxes",
            value: `${formatNumberWithCommas(
              price.includedTax || 0
            )} ${currency}`,
          },
          {
            label: "Excluded Taxes",
            value: `${formatNumberWithCommas(
              price.excludedTax || 0
            )} ${currency}`,
          },
          // { label: 'Travel Credit', value: `${price.travelCredit || 0} USD` },
          // { label: 'Explored Credit', value: `${price.exploredCredit || 0} USD` }
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 text-sm font-semibold">{label}</h3>
              <p
                className={`text-gray-800 text-sm font-medium text-end ${label === "Travel Credit" || label === "Explored Credit"
                  ? "text-red-500"
                  : ""
                  }`}
              >
                {value}
              </p>
            </div>
            {label === "Excluded Taxes" && price.excludedTax > 0 && (
              <p className="text-gray-800 bg-gray-100 p-2 rounded-md text-base font-normal ">
                Excluded Taxes (Payable at the hotel during check-in)
              </p>
            )}

          </div>
        ))}

        {nationality &&
          (nationality === "Australia" || nationality === "AU" || nationality === "au") && (
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 text-sm font-semibold">GST</h3>
              <p className={`text-gray-800 text-sm font-normal text-end `}>
                {(price.itemPrice * 0.1).toFixed(2)} (10%)
              </p>
            </div>
          )}
        {!subscriptionStatus?.is_active && plans && subscriptionType && (
          <div className="flex justify-between items-center">
            <h3 className="text-gray-800 text-sm font-semibold">Membership Fee</h3>
            <p className="text-gray-800 text-sm font-medium text-end  ">
              {plans.find((plan: any) => plan.type === subscriptionType)?.display_price} {plans.find((plan: any) => plan.type === subscriptionType)?.display_currency}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <h3 className="text-gray-800 text-base font-semibold">Total</h3>
        <p className="text-gray-800 text-lg font-semibold text-end">
          {" "}
          {formatNumberWithCommas(price.total)} {currency}
        </p>
      </div>
    </div>
  );
};

export default BookingSummary;
