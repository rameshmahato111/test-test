"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Location from "./Location";
import AvailabilityWrapper from "@/components/Details_page/AvailabilityWrapper";
import MobileGallery from "./MobileGallery";
import { CommonDetailPageData } from "@/types/details";
import { useSearchParams } from "next/navigation";
import Facilities from "./Facilities";

interface DetailsProps {
  id: string;
  details: CommonDetailPageData;
}

const Details = ({ id, details }: DetailsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const type = useSearchParams().get("type") || "";

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [details.description]);

  const activityLongitude = details.extraInfo?.routes[0]?.points[0]?.pointOfInterest?.geolocation?.longitude ?? '151.20695';
  const activityLatitude = details.extraInfo?.routes[0]?.points[0]?.pointOfInterest?.geolocation?.latitude ?? '-33.86873';

  return (
    <div className="w-full lg:w-[calc(100%-400px)] space-y-8">
      <div className="relative">
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${isExpanded ? 'max-h-none' : 'max-h-[4.5rem]'}
          `}
          style={isExpanded ? { maxHeight: `${contentHeight}px` } : {}}
        >
          <p
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: details.description }}
            className={`
              text-sm md:text-base  font-normal text-gray-600
              transition-opacity duration-300 ease-in-out
              ${isExpanded ? 'opacity-100' : 'opacity-90'}
            `}
          />

          {/* Gradient fade effect when collapsed */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        <button
          aria-label="Toggle description"
          aria-describedby="toggle-description-description"
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            mt-2 text-primary-400 flex items-center gap-1 font-medium 
            hover:text-primary-500 
          "
        >
          <span className="relative z-10 transition-colors duration-300">
            {isExpanded ? "Show Less" : "Show More"}
          </span>

          {/* Animated chevron */}
          <div className="relative w-4 h-4 ml-1">
            <ChevronDown
              className={`
                absolute inset-0 w-4 h-4 transition-all duration-300
                ${isExpanded ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'}
              `}
            />
            <ChevronUp
              className={`
                absolute inset-0 w-4 h-4 transition-all duration-300 
                ${isExpanded ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-75'}
              `}
            />
          </div>


        </button>
      </div>
      {details.country?.destinations &&
        details.country?.destinations.length > 0 && (
          <div className="space-y-2 bg-gray-100 p-4 rounded-md">
            <p className="text-gray-800 font-medium text-sm md:text-base">
              Destinations:
            </p>
            <p className="text-gray-800 font-normal text-sm md:text-base">
              {details.country?.destinations[0].name}
            </p>
          </div>
        )}

      {details.extraInfo?.redeemInfo.comments[0].description && (
        <div className="space-y-2 bg-green-50 p-4 rounded-md">
          <p className="text-gray-800 font-medium text-sm md:text-base">
            Note:
          </p>
          <p dangerouslySetInnerHTML={{ __html: details.extraInfo?.redeemInfo.comments[0].description }} className="text-gray-800 font-normal pl-4 text-sm md:text-base">

          </p>
        </div>
      )}
      {details.extraInfo?.routes && details.extraInfo?.routes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Itinerary Details
          </h3>
          {details.extraInfo?.routes.map((itinerary, index) => (
            <div key={index} className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">
                    {itinerary.description}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Duration: {itinerary.duration.value}{" "}
                    {itinerary.duration.metric.toLowerCase()}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {itinerary.timeFrom} - {itinerary.timeTo}
                </p>
              </div>

              <div className="space-y-3">
                {itinerary.points.map((point: any, pointIndex: any) => (
                  <div key={pointIndex} className="flex gap-3 items-start">
                    <div className="min-w-[24px] h-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full text-sm">
                      {point.order}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {point.pointOfInterest.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        {point.pointOfInterest.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <Facilities facilities={details.facilities || []} />

      {/* <div className='grid w-full  grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4'>
                <IconWithText text='Duration: 8–10 hours' iconClassName=' w-[24px] h-[24px]' gap='gap-3' icon='/icons/time.svg' textClassName='text-gray-800 font-normal text-sm md:text-base' />
                <IconWithText text='Live guide: English' iconClassName='w-[24px] h-[24px]' gap='gap-3' icon='/icons/globe.svg' textClassName='text-gray-800 font-normal text-sm md:text-base' />
                <IconWithText text='Ages 1-99' iconClassName='w-[24px] h-[24px]' gap='gap-3' icon='/icons/people.svg' textClassName='text-gray-800 font-normal text-sm md:text-base' />
                <IconWithText text='Parking Not Available' iconClassName='w-[24px] h-[24px]' gap='gap-3' icon='/icons/parking.svg' textClassName='text-gray-800 font-normal text-sm md:text-base' />
            </div> */}

      {/* {type === 'activity' && <AccordionSection details={details} />} */}

      <AvailabilityWrapper
        id={id}
        className="block lg:hidden w-full"
        position="main"
      />
      <Location
        latitude={
          type === "activity" ? activityLatitude : details.address?.coordinates.latitude
        }
        longitude={
          type === "activity" ? activityLongitude : details.address?.coordinates.longitude
        }
        locationName={details.name}
      />
      <MobileGallery images={details.images} type={type} id={id} />
      {/* <RatingSection
                id={id}
                type={type}
            />
            <ReviewSection id={id} type={type} /> */}
    </div>
  );
};

export default Details;
