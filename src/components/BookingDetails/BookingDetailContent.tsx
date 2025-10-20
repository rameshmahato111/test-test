"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HotelBookingDetail } from "./HotelBookingDetail";
import { ActivityAdditionalInfo } from "./ActivityBookingDetail";

// Custom Input component with error handling
export const FormInput = React.memo(
  ({
    label,
    id,
    name,
    type = "text",
    required = true,
    className,
    error,
    value,
    onChange,
    defaultValue,
    ...props
  }: {
    label: string;
    id: string;
    name: string;
    type?: string;
    required?: boolean;
    error?: string;
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    defaultValue?: string;
    [key: string]: any;
  }) => (
    <div className={className}>
      <Label htmlFor={id} className="text-base font-medium text-gray-800">
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className={`w-full mt-2 ${error ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
);

export const HolderInfoSection = ({ errors, user }: { errors: Record<string, string>, user: any }) => (
  <div className="px-6 py-8 border border-gray-200 rounded-[20px] shadow-cardShadow">
    <h2 className="text-xl font-semibold text-foreground pb-2">Holder Info</h2>
    <p className="text-sm font-normal text-gray-800 pb-4">
      Primary contact for this booking
    </p>

    <div className="space-y-6">
      <FormInput
        label="First Name"
        id="holderFirstName"
        name="holderFirstName"
        error={errors.holderFirstName}
        minLength={2}
        defaultValue={user?.first_name}

      />
      <FormInput
        label="Last Name"
        id="holderLastName"
        name="holderLastName"
        error={errors.holderLastName}
        minLength={2}
        defaultValue={user?.last_name}
      />
    </div>
  </div>
);





const BookingDetailContent = ({ type }: { type: string }) => {
  if (type === "activity") {
    return <ActivityAdditionalInfo />;
  } else if (type === "hotel") {
    return <HotelBookingDetail type={type} />;
  }
};
export default BookingDetailContent;



