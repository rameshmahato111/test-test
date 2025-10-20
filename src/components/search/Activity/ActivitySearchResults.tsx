"use client";
import React, { useMemo } from "react";
import Card from "@/components/Cards/Card";
import ActivityResultHeader from "./ActivityResultHeader";
import { useSearchDetail } from "@/contexts/SearchDetailContext";
import CustomPagination from "@/components/CustomPagination";
import { DataWithCount } from "@/types";
import { Activity } from "@/schemas/activities";

interface Props {
  result?: DataWithCount<Activity>;
}

const ActivitySearchResults = ({ result }: Props) => {
  if (!result) return null;

  const { setActivityDetail } = useSearchDetail();

  // Memoize total pages calculation
  const totalPages = useMemo(
    () => (result?.count ? Math.ceil(result.count / 10) : 1),
    [result?.count]
  );

  // Memoize card data transformation
  const cardData = useMemo(
    () => (card: Activity) => ({
      imageSrc: getCardImage(card),
      title: card.name,
      id: parseInt(card.id),
      rating: card.avg_rating.toString(),
      price: card.amountsFrom[0].amount.toString(),
      currency: card.currencyName,
      location: card.country.name,
      policy: card.modalities[0].rates[0].freeCancellation,
      originalPrice: card.amountsFrom[0].originalPrice?.toString() ?? "0",
      farePrice: card.amountsFrom[0].farePrice?.toString() ?? "0",
    }),
    []
  );

  // Helper function to get the card image
  const getCardImage = (card: Activity): string => {
    return card.images.map((image) => {
      return (
        image.urls.find((url) => url.sizeType === "XLARGE")?.resource ||
        image.urls[0].resource
      );
    })[0];
  };

  const handleCardClick = (activity: Activity, requestId: string) => {
    setActivityDetail({ ...activity, request_id: requestId });
  };

  return (
    <div className="w-full">
      <ActivityResultHeader />
      <div
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        }}
        className="grid gap-6 w-full pb-10"
      >
        {result.results.map((card) => (
          <Card
            key={card.id}
            onClick={() => handleCardClick(card, result.request_id || "")}
            type="activity"
            card={cardData(card)}
            className="w-full"
            newWindow={true}
          />
        ))}
      </div>
      {result.count > 10 && <CustomPagination totalPages={totalPages} />}
    </div>
  );
};



export default ActivitySearchResults;