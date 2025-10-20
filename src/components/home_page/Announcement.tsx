import React from "react";
import { OfferApi } from "@/services/api/offer";
import { format } from "date-fns";
const Announcement = async () => {
  const offers = (await OfferApi.getOffers())[0];
  if (offers.end_date < format(new Date(), 'yyyy-MM-dd')) {
    return null;
  }
  return (
    <div className=" hidden md:flex  bg-primary-400  py-1  px-4 md:px-8 lg:px-10  justify-between items-center text-background">
      <p className="text-sm font-semibold">
        Deals of the week: {offers.name} |
        <span className="font-semibold"> Up to {offers.discount_percentage}% OFF</span>
      </p>
      <p className="text-[10px] font-semibold text-background bg-primary-600 px-3  rounded-[36px] py-1">
        {offers.end_date}
      </p>
    </div>
  );
};

export default Announcement;
