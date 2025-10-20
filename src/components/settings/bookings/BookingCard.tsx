import WriteReview from "@/components/Details_page/WriteReview";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { HotelBooking } from "@/schemas/bookings";
import { MyBookingApi } from "@/services/api/my-booking";
import {
  Hotel,
  Users,
  Calendar,
  MapPin,
  Bed,
  Star,
  Clock,
  Ban,
} from "lucide-react";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { formatNumberWithCommas } from "@/utils";
interface BookingCardProps {
  booking: HotelBooking;
  existingReviews: Record<string, boolean>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const BookingCard = ({ booking, existingReviews }: BookingCardProps) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  const nights = Math.ceil(
    (new Date(booking.check_out).getTime() -
      new Date(booking.check_in).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const categoryStars = booking.extras.hotelInfo?.categoryCode
    ? parseInt(booking.extras.hotelInfo.categoryCode)
    : 0;

  const totalAdults =
    booking.extras.hotelInfo && booking.extras.hotelInfo.rooms && booking
      ? booking.extras?.hotelInfo?.rooms?.reduce(
          (acc: any, room: any) => acc + (room.rates[0]?.adults || 0),
          0
        ) || 0
      : 0;

  const totalChildren =
    booking.extras?.hotelInfo?.rooms?.reduce(
      (acc: any, room: any) => acc + (room.rates[0]?.children || 0),
      0
    ) || 0;

  const totalRooms = booking.extras?.hotelInfo?.rooms?.length || 0;

  const handleCancelBooking = async () => {
    await MyBookingApi.cancelHotelBooking(token!, booking.id.toString());
    toast({
      title: "Booking cancelled successfully",
      description: "Your booking has been cancelled successfully",
      variant: "success",
    });
    queryClient.invalidateQueries({ queryKey: ["hotelBookings"] });
  };

  const hasReviewed = existingReviews[`hotel|${booking.object_id}`] || false;

  const checkInDate = new Date(booking.check_in);
  const currentDate = new Date();

  const isDateValid =
    checkInDate.getFullYear() > currentDate.getFullYear() ||
    (checkInDate.getFullYear() === currentDate.getFullYear() &&
      checkInDate.getMonth() > currentDate.getMonth()) ||
    (checkInDate.getFullYear() === currentDate.getFullYear() &&
      checkInDate.getMonth() === currentDate.getMonth() &&
      checkInDate.getDate() >= currentDate.getDate());

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Status Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              booking.status === "CONFIRMED"
                ? "bg-green-100 text-green-800"
                : booking.status === "CANCELLED"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {booking.status}
          </span>
          {booking.is_cancellable && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
              Cancellable
            </span>
          )}
        </div>
        <p className="text-sm font-mono text-gray-600">
          Ref: {booking.reference_code}
        </p>
      </div>

      <div className="p-4">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Image & Basic Info */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {/* Hotel Image */}
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                {booking.extras?.image ? (
                  <img
                    src={booking.extras.image}
                    alt={booking.extras?.name || "Hotel"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Hotel className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Hotel Name & Category */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.extras?.name || "Hotel Name Not Available"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {categoryStars > 0 && (
                    <div className="flex">
                      {[...Array(categoryStars)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Box */}
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-primary-700">
                    {formatNumberWithCommas(parseFloat(booking.total_net))}{" "}
                    {booking.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Stay Details */}
              <div className="grid grid-cols-2  gap-4">
                <DetailCard
                  icon={<Calendar className="w-5 h-5" />}
                  title="Check-in"
                  value={formatDate(booking.check_in)}
                />
                <DetailCard
                  icon={<Calendar className="w-5 h-5" />}
                  title="Check-out"
                  value={formatDate(booking.check_out)}
                />
                <DetailCard
                  icon={<Clock className="w-5 h-5" />}
                  title="Duration"
                  value={`${nights} nights`}
                />
                <DetailCard
                  icon={<Users className="w-5 h-5" />}
                  title="Guests"
                  value={`${totalAdults} Adults${
                    totalChildren > 0 ? `, ${totalChildren} Children` : ""
                  }`}
                />
              </div>

              {/* Guest Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Guest Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Guest Name</p>
                    <p className="font-medium">{`${booking.holder.name} ${booking.holder.surname}`}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{booking.holder.email}</p>
                    <p className="font-medium">{booking.holder.phone_number}</p>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              {booking.extras?.hotelInfo?.rooms[0]?.rates[0]
                ?.cancellationPolicies && (
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Cancellation Policy
                  </h4>
                  <div className="space-y-3">
                    {booking.extras.hotelInfo.rooms[0].rates[0].cancellationPolicies.map(
                      (policy: any, index: any) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm border-b pb-2 last:border-0"
                        >
                          <span className="text-gray-600">
                            {policy.from ? formatDate(policy.from) : "Now"} -{" "}
                            {policy.to ? formatDate(policy.to) : "Check-in"}
                          </span>
                          <span className="font-medium">
                            {formatNumberWithCommas(parseFloat(policy.amount))}{" "}
                            {booking.currency}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {booking.status !== "CANCELLED" && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsWriteReviewOpen(true)}
                    disabled={hasReviewed || booking.status !== "CONFIRMED"}
                  >
                    {hasReviewed ? "Already Reviewed" : "Write A Review"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={!booking.is_cancellable}
                    onClick={handleCancelBooking}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <WriteReview
        objectId={booking.object_id}
        contentType="hotel"
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
      />
    </div>
  );
};

// Helper component for detail cards
const DetailCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="bg-white rounded-lg p-3 border">
    <div className="flex items-center gap-2 text-gray-600 mb-1">
      {icon}
      <span className="text-xs">{title}</span>
    </div>
    <p className="text-sm font-medium">{value}</p>
  </div>
);

export default BookingCard;
