import React, { useState, useRef, TouchEvent, MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RoomCarouselProps {
  images: Array<{ path: string }>;
  roomId: number;
}

const RoomCarousel = ({ images, roomId }: RoomCarouselProps) => {
  const filteredImages = images
    ? images.filter((image) => image.path).map((image) => `${image.path}`)
    : [];

  if (filteredImages.length === 0) {
    filteredImages.push("/images/default-image.png");
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigateLeft = () => {
    setCurrentImageIndex((prev) =>
      prev - 1 < 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const navigateRight = () => {
    setCurrentImageIndex((prev) =>
      prev + 1 >= filteredImages.length ? 0 : prev + 1
    );
  };

  return (
    <div className="relative h-64 cursor-grab active:cursor-grabbing select-none">
      {/* Navigation Arrows */}
      {filteredImages.length > 1 && (
        <>
          <button
            onClick={navigateLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Previous image"
            aria-describedby="previous-image-description"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={navigateRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Next image"
            aria-describedby="next-image-description"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Current Image */}
      <img
        src={filteredImages[currentImageIndex]}
        alt={`Room image ${currentImageIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-300"
        draggable="false"
      />

      {/* Image Indicators */}
      <div
        className="absolute bottom-2 left-0 right-0 flex justify-center gap-2"
        role="tablist"
      >
        {filteredImages.map((_, index) => (
          <button
            aria-label={`Go to image ${index + 1}`}
            aria-describedby="go-to-image-description"
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index ? "bg-white scale-110" : "bg-white/50"
              }`}
            role="tab"
            aria-selected={currentImageIndex === index}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomCarousel;
