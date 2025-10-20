import React from "react";
import { CardProps } from "@/types";
import FavouriteToggler from "./FavouriteToggler";
import { formatNumberWithCommas } from "@/utils";
import Link from "next/link";
import icons from "currency-icons";
import { Star, MapPin } from "lucide-react";

const Card = ({
  card,
  className,
  type,
  onClick,
  newWindow,
}: {
  card: CardProps;
  className?: string;
  type: string;
  onClick?: () => void;
  newWindow?: boolean;
}) => {
  const {
    id,
    imageSrc,
    title,
    rating,
    location,
    currency = "AUD",
    discount,
    showBadge,
    policy,
    originalPrice,
    farePrice,
  } = card;

  const renderCancellationInfo = () => {
    if (type !== "activity") return null;

    return (
      <div className="absolute top-2 left-2 z-10">
        {policy ? (
          <div className="bg-white/90 backdrop-blur-sm shadow-sm px-1.5 py-1 rounded-full inline-flex items-center gap-1.5">

            <span className="text-[10px] font-medium text-gray-900">Free Cancel</span>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm shadow-sm px-1.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-gray-900">Non-Refundable</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`h-full group relative hover:-translate-y-2 transition-all duration-300 w-[295px] ${className}`}
    >
      <div className="absolute top-3 right-2 z-10">
        <FavouriteToggler cardId={id} contentType={type} />
      </div>
      {renderCancellationInfo()}
      <Link
        prefetch={false}
        href={`/detail/${id}/?type=${type}`}
        className=" "

        onClick={onClick}
      >
        <div
          className={`bg-background my-2 h-full rounded-lg cursor-pointer shadow-cardShadow overflow-hidden relative w-[295px] flex flex-col ${className}`}
        >
          <div className="relative h-[188px] overflow-hidden">
            <img
              loading="lazy"
              src={imageSrc}
              alt="card"
              className="w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
            />
            {showBadge && (
              <div className="absolute bottom-0 left-0 bg-primary-400 text-background p-1 rounded-r-[4px] hover:bg-none flex items-center gap-1">
                <img src="/icons/badge.svg" alt="badge" className="w-4 h-4" />
                <p className="text-xs md:text-sm font-medium">
                  {discount}% Discount
                </p>
              </div>
            )}
          </div>

          <div className="pt-6 pb-2 px-3 flex flex-col flex-1">
            <h2 className="text-xl line-clamp-2 font-semibold text-gray-800">
              {title}
            </h2>
            <div className="flex flex-wrap gap-3 pt-2 flex-1">
              {rating && parseInt(rating) > 1 && (
                <div className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-700">{rating}</span>
                </div>
              )}
              {location && (
                <div className="inline-flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                  <span className="text-sm text-gray-700">{location}</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-auto py-2">
              {originalPrice && <div className="flex-1  justify-start border rounded-md py-2 flex flex-col items-start  px-2 bg-white">
                <span className="text-gray-500 text-[10px] font-poppins font-medium">Regular Price</span>
                <span className="text-sm font-bold text-gray-800 ">
                  {icons[currency]?.symbol}{formatNumberWithCommas(parseFloat(originalPrice))} {" "}{currency}
                </span>

              </div>}
              {farePrice && originalPrice && <div className="flex-1  relative rounded-md py-2 flex flex-col items-start justify-between px-2 bg-primary-400">
                <span className="text-white text-[10px] font-poppins font-medium">Discounted</span>
                <span className="text-sm font-bold text-white ">
                  {icons[currency]?.symbol} {formatNumberWithCommas(parseFloat(farePrice))} {" "}{currency}
                </span>

              </div>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
