import WriteReview from "@/components/Details_page/WriteReview";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MyBookingApi } from "@/services/api/my-booking";
import { ActivityBooking } from "@/schemas/bookings";
import { MapPin, Calendar, Users, Ticket, Ban, CreditCard } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

interface ActivityBookingCardProps {
  booking: ActivityBooking;
  existingReviews: Record<string, boolean>;
}

const ActivityBookingCard = ({
  booking,
  existingReviews,
}: ActivityBookingCardProps) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  const mainImage = booking.extras.image;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };



  const handleCancelBooking = async () => {
    await MyBookingApi.cancelActivityBooking(token!, booking.id.toString());
    toast({
      title: "Booking cancelled successfully",
      description: "Your booking has been cancelled successfully",
    });
    queryClient.invalidateQueries({ queryKey: ["activityBookings"] });
  };

  const hasReviewed = existingReviews[`activity|${booking.object_id}`] || false;

  // Extract location from comments if available
  const locationInfo = booking.extras.activity_info[0].comments?.find(
    (comment) => comment.type === "CONTRACT_REMARKS"
  )?.text;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-sm">
      {/* Status Banner with Cancellable Tag */}
      <div className="px-4 py-2 flex justify-between items-center">
        <span
          className={`text-xs font-medium ${booking.status === "CONFIRMED"
              ? "text-green-700"
              : "text-yellow-700"
            }`}
        >
          {booking.status}
        </span>
        {booking.is_cancellable && (
          <span className="text-[10px] font-medium text-primary-600">
            Cancellable
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Image Section */}
          <div className="relative w-full lg:w-48 h-48 lg:h-40 rounded-lg overflow-hidden flex-shrink-0">
            {mainImage ? (
              <img
                src={mainImage}
                alt={booking.extras.activity_info[0].name}
                className="object-cover w-full h-full"
                sizes="(max-width: 640px) 100vw, 192px"
              />
            ) : (
              <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                <Ticket className="w-16 h-16 text-primary-200" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 space-y-4 min-w-0">
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {booking.extras.activity_info[0].name}
              </h3>
              {/* {locationInfo && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <MapPin className="w-4 h-4" />
                                    <span className="line-clamp-1">
                                        {locationInfo.split('//')[0]}
                                    </span>
                                </div>
                            )} */}
            </div>

            {/* Details Grid */}
            <div className=" flex flex-wrap gap-4 xl:gap-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-xs md:text-sm text-gray-600">
                    {formatDate(
                      booking.extras.activity_info[0].dateFrom ||
                      booking.check_in
                    )}
                  </p>
                  <p className="text-xs text-gray-400">Activity Date</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-xs md:text-sm text-gray-600">
                    {booking.extras.activity_info[0].paxes.length}{" "}
                    {booking.extras.activity_info[0].paxes.length === 1
                      ? "person"
                      : "people"}
                  </p>
                  <p className="text-xs text-gray-400">Participants</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-xs md:text-sm text-gray-600">
                    {booking.total_net} {booking.currency}
                  </p>
                  <p className="text-xs text-gray-400">Total Amount</p>
                </div>
              </div>
            </div>

            {/* Meeting Point Info */}
            {locationInfo && (
              <div className="flex gap-2 p-3 bg-primary-50 rounded-lg">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-primary-600 mb-1">
                    Meeting Point
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 ">
                    {locationInfo.split("Meeting point:")[1]?.split("//")[0] ||
                      "Meeting point information not available"}
                  </p>
                </div>
              </div>
            )}

            {/* WriteReview Component */}
            <WriteReview
              objectId={booking.object_id}
              contentType="activity"
              isOpen={isWriteReviewOpen}
              onClose={() => setIsWriteReviewOpen(false)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          {/* Primary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full border-primary-400 text-primary-400 text-sm font-semibold rounded-lg"
              onClick={() => setIsWriteReviewOpen(true)}
              disabled={hasReviewed}
            >
              {hasReviewed ? "Already Reviewed" : "Write A Review"}
            </Button>

            <Button
              variant="outline"
              className="w-full border-red-400 text-red-400 hover:bg-red-50 text-sm font-semibold rounded-lg"
              onClick={handleCancelBooking}
              disabled={booking.status === "CANCELLED"}
            >
              <Ban className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            {/* <Button
                            variant='outline'
                            className='w-full border-primary-400 text-primary-400 text-sm font-semibold rounded-lg'
                            onClick={handleDownloadTicket}
                        >
                            <Ticket className="w-4 h-4 mr-2" />
                            Ticket
                        </Button> */}
          </div>

          {/* Secondary Actions */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default ActivityBookingCard;
