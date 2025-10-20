import React from "react";
import FavouriteToggler from "./FavouriteToggler";
import IconWithText from "./IconWithText";
import Link from "next/link";
import { HotelResult } from "@/schemas/hotel";
import { formatNumberWithCommas } from "@/utils";
import { useSearchParams } from "next/navigation";

const HotelResultCard = ({
  card,
  onClick,
}: {
  card: HotelResult;
  onClick: () => void;
}) => {
  const {
    id,
    name,
    address,
    rooms,
    categoryName,
    currency,
    originalPrice,
    farePrice,
    avg_rating,
    top_facilities,
  } = card;


  const cancellationPolicy = rooms.some((room) =>
    room.rates.some(
      (rate) =>
        rate.cancellationPolicies && rate.cancellationPolicies[0].amount &&
        parseFloat(rate.cancellationPolicies[0].amount) > 0
    )
  );
  const image = card.hotel_images[0]
    ? `${card.hotel_images[0].path}`
    : "/images/default-image.png";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6  shadow-cardShadow  rounded-lg overflow-hidden bg-background w-full">
      <div className="relative max-h-[340px]  overflow-hidden col-span-1 object-cover ">
        <div className="absolute top-2 right-2 z-10">
          <FavouriteToggler cardId={id} contentType="hotel" />
        </div>
        <img src={image} alt={name} className="w-full h-full object-cover" />
        {false && (
          <div className="absolute bottom-0 left-0 bg-primary-400 text-background p-1 rounded-r-[4px] hover:bg-none flex items-center gap-1">
            <img src="/icons/badge.svg" alt="badge" className="w-4 h-4" />
            <p className="text-xs md:text-sm font-medium ">{4}% Discount</p>
          </div>
        )}
      </div>
      <div className=" col-span-1 md:col-span-2 py-4">
        <h2 className="text-base sm:text-xl xl:text-2xl pb-3 font-semibold text-foreground">
          {name}
        </h2>
        <div className="flex gap-2 md:gap-2 flex-wrap pb-4 md:pb-6">
          <IconWithText
            text={address.city}
            iconClassName="w-4 h-4"
            textClassName="text-sm"
            icon="/icons/location.svg"
          />
          <IconWithText
            text={categoryName}
            iconClassName="w-4 h-4"
            textClassName="text-sm"
            icon="/icons/building.svg"
          />
          {avg_rating > 0 && (
            <IconWithText
              text={avg_rating.toString()}
              iconClassName="w-4 h-4"
              textClassName="text-sm"
              icon="/icons/star.svg"
            />
          )}
        </div>
        <div className="p-3 w-[98%] xl:w-[95%] bg-gray-50 rounded-xl  pb-5 border border-gray-color-100 flex flex-col md:flex-row gap-2 justify-between">
          <div>
            <h5 className="text-xs xl:text-sm font-medium text-gray-700">
              Room Type:
            </h5>
            <p className="text-xs xl:text-sm font-normal line-clamp-2 text-gray-700">
              {rooms[0].name}
            </p>
            <p className="text-xs xl:text-sm font-normal text-primary-300 py-1">
              Only {rooms.length} room left
            </p>
            <p className={` hidden md:block text-xs xl:text-sm font-normal ${cancellationPolicy ? "text-red-500" : "text-green-0"}`}>
              {cancellationPolicy ? "No Free" : "free"} Cancellation
            </p>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">

              {top_facilities?.map((facility, index) => (
                <div key={index} className="flex items-center gap-4">
                  {facility.image && <img title={facility.description || ''} src={facility.image} alt={facility.description} className="w-4 h-4" />}
                  {/* <p className="text-xs xl:text-sm font-normal text-gray-700">{facility.description}</p> */}
                </div>
              ))}
            </div>


          </div>
        </div>
        <div>

          <div className="flex flex-col md:flex-row gap-4 mt-5">
            {originalPrice && <div onClick={onClick} className="flex-1 cursor-pointer justify-between border rounded-md py-6 flex md:flex-col xl:flex-row  items-center  px-4 bg-white">
              <span className="text-gray-500 text-sm font-poppins font-medium">Regular Price</span>
              <span className="text-xl font-bold text-gray-800 ">
                {formatNumberWithCommas(parseFloat(originalPrice))} {" "}{currency}
              </span>
            </div>}
            {farePrice && originalPrice && <div onClick={onClick} className="flex-1 cursor-pointer relative rounded-md py-6 flex md:flex-col xl:flex-row  items-center justify-between px-4 bg-primary-400">
              <span className="text-white text-sm font-poppins font-medium">Discounted</span>
              <span className="text-xl font-bold text-white ">
                {formatNumberWithCommas(parseFloat(farePrice))} {" "}{currency}
              </span>
              <span className="absolute -top-3 right-3 bg-pink-200 text-pink-700 text-xs font-semibold px-3 py-1 rounded shadow">
                Save {formatNumberWithCommas(parseFloat(originalPrice) - parseFloat(farePrice))} {" "}{currency}
              </span>
              <span className="absolute bottom-2 left-3 flex gap-2 items-center">
                <img src="icons/logo-white.png" alt="logo" className="h-3.5" />
              </span>
            </div>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelResultCard;