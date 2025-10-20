import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Facility {
  description: string;
  image: string | null;
  facility_fee: boolean;
}

const Facilities = ({ facilities }: { facilities: Facility[] }) => {
  const [showAll, setShowAll] = useState(false);
  const [maxHeight, setMaxHeight] = useState<string>("auto");
  const contentRef = useRef<HTMLUListElement>(null);

  // Initial display limit
  const initialLimit = 10;

  // Calculate height when showAll state changes
  useEffect(() => {
    if (contentRef.current) {
      if (showAll) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setMaxHeight(`140px`);
      }
    }
  }, [showAll, facilities]);

  return (
    <div className="w-full">
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: maxHeight }}
      >
        <ul
          ref={contentRef}
          className="grid w-full grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-2"
        >
          {facilities?.map((facility, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 transition-all duration-300 ease-in-out ${index >= initialLimit && !showAll
                ? 'opacity-0 transform translate-y-2'
                : 'opacity-100 transform translate-y-0'
                }`}
              style={{
                transitionDelay: showAll ? `${(index - initialLimit) * 10}ms` : '0ms'
              }}
            >
              {facility.image ? (
                <img
                  src={facility.image}
                  alt={facility.description}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-100 rounded-full" />
              )}

              <p className="text-gray-800 font-normal text-sm md:text-base">
                {facility.description}{" "}
                {facility.facility_fee && (
                  <span className="text-amber-600 font-medium">(Paid)</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {facilities?.length > initialLimit && (
        <button
          aria-label="Toggle facilities"
          aria-describedby="toggle-facilities-description"
          onClick={() => setShowAll(!showAll)}
          className="mt-0 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors w-full py-2 "
        >
          <span className="transition-all duration-200">
            {showAll ? "Show Less" : `View All Facilities (${facilities.length})`}
          </span>
          <div className={`transition-transform duration-300 ${showAll ? 'rotate-180' : 'rotate-0'}`}>
            <ChevronDown size={16} />
          </div>
        </button>
      )}
    </div>
  );
};

export default Facilities;
