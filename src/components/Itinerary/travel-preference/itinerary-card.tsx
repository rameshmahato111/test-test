"use client";

import {
  Car,
  MapPin,
  ParkingCircle,
  EllipsisVertical,
  Star,
  ChevronRight,
  Ticket,
  Camera,
  Clock,
  Info,
  GripVertical,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ItineraryCardProps = {
  travelMeta: string;
  imageSrc: string;
  title: string;
  address: string;
  showDirections?: boolean;
  priceText?: string;
  rating?: number;
  timeRange?: string;
  ctaKind?: "ticket" | "details";
  onNavigate: () => void;
  onCta: () => void;
  latitude: number;
  longitude: number;
  startLatitude?: number;
  startLongitude?: number;
  onViewParking: (params: {
    latitude: number;
    longitude: number;
    name: string;
  }) => void;
  timeLabel?: string;
  durationText?: string;
  onSuggestAlternative?: () => void;
  onTimeChange?: () => void;
};

const ItineraryCard: React.FC<ItineraryCardProps> = ({
  travelMeta,
  imageSrc,
  title,
  address,
  showDirections = true,
  priceText = "$12",
  rating = 5,
  timeRange = "11-12:4 (1hr 45min)",
  ctaKind = "ticket",
  onNavigate,
  onCta,
  latitude,
  longitude,
  onViewParking,
  timeLabel,
  durationText,
  onSuggestAlternative,
  onTimeChange,
  startLatitude,
  startLongitude,
}) => {
  const [parking, setParking] = React.useState<{
    name: string;
    address: string;
    distance_meters: number;
    distance_display: string;
    latitude: number;
    longitude: number;
    price_display?: string | null;
    is_free?: boolean;
    available?: boolean;
  } | null>(null);
  const [parkingLoading, setParkingLoading] = React.useState(false);
  const [parkingError, setParkingError] = React.useState<string | null>(null);
  const [parkingOptions, setParkingOptions] = React.useState<
    Array<{
      id: string;
      name: string;
      address: string;
      distance_display: string;
      latitude: number;
      longitude: number;
      price_display?: string | null;
      is_free?: boolean;
      available?: boolean;
    }>
  >([]);
  const [showParkingModal, setShowParkingModal] = React.useState(false);
  const [selectedParkingId, setSelectedParkingId] = React.useState<string | null>(null);
  const [parkingStatus, setParkingStatus] = React.useState<
    "unknown" | "available" | "not_available" | "error"
  >("unknown");

  const [distanceKm, setDistanceKm] = React.useState<number | null>(null);
  const [distanceLoading, setDistanceLoading] = React.useState(false);
  const [distanceError, setDistanceError] = React.useState<string | null>(null);
  const [durationH, setDurationH] = React.useState<number | null>(null);

  React.useEffect(() => {
    const hasCoords =
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      typeof startLatitude === "number" &&
      typeof startLongitude === "number";
    if (!hasCoords) return;
    let aborted = false;
    const fetchDistance = async () => {
      try {
        setDistanceLoading(true);
        setDistanceError(null);
        const url = `https://api-v2.exploreden.com/itinify/maps/distance-calculator/?start_longitude=${encodeURIComponent(
          String(startLongitude)
        )}&start_latitude=${encodeURIComponent(
          String(startLatitude)
        )}&end_longitude=${encodeURIComponent(
          String(longitude)
        )}&end_latitude=${encodeURIComponent(String(latitude))}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`distance api ${res.status}`);
        const data = await res.json();
        // Try common shapes
        let km: number | null = null;
        const parseMaybeStringKm = (v: any): number | null => {
          if (typeof v === "number") return v;
          if (typeof v === "string") {
            const num = Number(v.replace(/[^0-9.,-]/g, "").replace(",", "."));
            return Number.isFinite(num) ? num : null;
          }
          return null;
        };
        km = parseMaybeStringKm(data?.distance_km);
        if (km == null) km = parseMaybeStringKm(data?.data?.distance_km);
        if (km == null) km = parseMaybeStringKm(data?.distance_in_km);
        if (km == null) {
          const meters1 = parseMaybeStringKm(data?.distance_meters);
          if (meters1 != null) km = meters1 / 1000;
        }
        if (km == null) {
          const meters2 = parseMaybeStringKm(data?.data?.distance_meters);
          if (meters2 != null) km = meters2 / 1000;
        }
        if (km == null) {
          const meters3 = parseMaybeStringKm(data?.distance);
          if (meters3 != null) km = meters3 / 1000;
        }
        if (!aborted) {
          setDistanceKm(Number.isFinite(km as number) ? (km as number) : null);
          const dh =
            typeof data?.duration_h === "number"
              ? data.duration_h
              : typeof data?.data?.duration_h === "number"
              ? data.data.duration_h
              : null;
          setDurationH(Number.isFinite(dh as number) ? (dh as number) : null);
        }
      } catch (e: any) {
        if (!aborted) {
          setDistanceError(e.message || "distance error");
          setDistanceKm(null);
        }
      } finally {
        if (!aborted) setDistanceLoading(false);
      }
    };
    fetchDistance();
    return () => {
      aborted = true;
    };
  }, [latitude, longitude, startLatitude, startLongitude]);

  const fetchParking = React.useCallback(async () => {
    let aborted = false;
      try {
        setParkingLoading(true);
        setParkingError(null);
        const url = `https://api-v2.exploreden.com/itinify/parking/free-search/?latitude=${encodeURIComponent(
          latitude
        )}&longitude=${encodeURIComponent(longitude)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`parking api ${res.status}`);
        const json = await res.json();
        const data = json?.data;
        if (!data) throw new Error("invalid parking payload");

        let pick: any = null;
        if (
          Array.isArray(data.free_parking_options) &&
          data.free_parking_options.length > 0
        ) {
          pick = data.free_parking_options[0];
        } else if (data?.summary?.best_paid_option) {
          pick = data.summary.best_paid_option;
        } else if (
          Array.isArray(data.paid_parking_options) &&
          data.paid_parking_options.length > 0
        ) {
          pick = data.paid_parking_options[0];
        } else if (
          Array.isArray(data.all_parking_options) &&
          data.all_parking_options.length > 0
        ) {
          pick = data.all_parking_options[0];
        }

        if (!aborted && pick?.location) {
          setParking({
            name: pick.name || pick.location_display || "Parking",
            address: pick.address || "",
            distance_meters: Number(pick.distance_meters) || 0,
            distance_display: pick.distance_display || "",
            latitude: Number(pick.location.latitude),
            longitude: Number(pick.location.longitude),
            price_display: pick.price_display ?? null,
            is_free: !!pick.is_free,
            available: pick.available === true,
          });
          // build options list preference: free -> paid -> all
          const buildList = (arr: any[] | undefined) =>
            Array.isArray(arr)
              ? arr
                  .filter((p) => p?.location)
                  .map((p: any, idx: number) => ({
                    id: String(
                      (p.id ?? p.place_id ?? p.location_display ?? idx) +
                        "-" +
                        String(p.location.latitude) +
                        "," +
                        String(p.location.longitude)
                    ),
                    name: p.name || p.location_display || "Parking",
                    address: p.address || "",
                    distance_display: p.distance_display || "",
                    latitude: Number(p.location.latitude),
                    longitude: Number(p.location.longitude),
                    price_display: p.price_display ?? null,
                    is_free: !!p.is_free,
                    available: p.available === true,
                  }))
              : [];
          const freeList = buildList(data.free_parking_options);
          const paidList = buildList(data.paid_parking_options);
          const allList = buildList(data.all_parking_options);
          const options = freeList.length
            ? freeList
            : paidList.length
            ? paidList
            : allList;
          setParkingOptions(options);
          // Auto-select the first option by default
          if (!selectedParkingId && options.length > 0) {
            setSelectedParkingId(options[0].id);
          }
          setParkingStatus(options.length > 0 || pick?.available === true ? "available" : "not_available");
        }
      } catch (e: any) {
        if (!aborted) {
          setParkingError(e.message);
          setParking(null);
          setParkingStatus("error");
        }
      } finally {
        if (!aborted) setParkingLoading(false);
      }
    return () => {
      aborted = true;
    };
  }, [latitude, longitude, selectedParkingId]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-start gap-3 ">
        {/* Left side with time label and grip */}
        <div className="flex flex-col items-center w-8 h-full relative">
          {/* Time label above the grip */}
          <div className="absolute top-12 mr-5 ">
            <div className="hidden sm:flex items-center rounded-full  px-2 py-1 text-xs font-medium  whitespace-nowrap">
              {timeLabel}
            </div>
          </div>
          {/* Grip vertical */}
          <div className="shrink-0 pt-20 md:pt-32">
            <GripVertical className="h-6 w-6 text-slate-400" />
          </div>
        </div>

        <div className="flex-1">
          {/* Travel meta and Navigate button */}
          {showDirections && (
            <div className="mb-3 flex items-center justify-between mx-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base break-words">
                <Car className="h-5 w-5 text-slate-700" />
                <span className="font-medium text-slate-700 break-words leading-snug">
                  {(() => {
                    const base = travelMeta.replace(/\(.*?\)/, "").trim();
                    const fmtDuration = (h: number) => {
                      const totalMin = Math.round(h * 60);
                      const hours = Math.floor(totalMin / 60);
                      const minutes = totalMin % 60;
                      if (hours > 0 && minutes > 0) return `${hours} hr ${minutes} min`;
                      if (hours > 0) return `${hours} hr`;
                      return `${minutes} min`;
                    };
                    const dur = durationH != null ? fmtDuration(durationH) : null;
                    if (distanceKm != null && dur) return `${dur} (${distanceKm.toFixed(2)} Km)`;
                    if (distanceKm != null) return `${base} (${distanceKm.toFixed(2)} Km)`;
                    return travelMeta;
                  })()}
                </span>
              </div>
              <Button
                variant="ghost"
                className="text-xs sm:text-sm md:text-base font-semibold hover:bg-transparent px-0"
                onClick={onNavigate}
              >
                Navigate
              </Button>
            </div>
          )}

          {/* Main card */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Desktop layout */}
            <div className="hidden md:flex">
              {/* Image section - left side on desktop */}
              <div className="relative w-[40%] h-auto shrink-0">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="40vw"
                  loading="lazy"
                  quality={75}
                />

                {/* Pink circular badge - top-left corner */}
                <div className="absolute left-0 top-0 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 p-3 shadow-lg">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Content section - right side */}
              <div className="flex-1 flex flex-col">
                <div className="px-6 pt-6 flex-1 flex flex-col">
                  {/* Header with rating and menu */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      {/* 5-star rating */}
                      {/* 5-star rating with partial fills */}
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = star <= Math.floor(rating);
                          const isPartiallyFilled =
                            star === Math.ceil(rating) && rating % 1 > 0;

                          return (
                            <div key={star} className="relative h-6 w-6">
                              {/* Background star (always gray) */}
                              <Star className="absolute h-6 w-6 text-slate-300" />

                              {/* Filled portion (pink) */}
                              <div
                                className="absolute top-0 left-0 overflow-hidden"
                                style={{
                                  width: isFilled
                                    ? "100%"
                                    : isPartiallyFilled
                                    ? `${(rating % 1) * 100}%`
                                    : "0%",
                                }}
                              >
                                <Star className="h-6 w-6 fill-pink-500 text-pink-500" />
                              </div>
                            </div>
                          );
                        })}
                        <span className="ml-1 text-sm text-slate-500">
                          {rating.toFixed(1)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1.5 break-words leading-snug">
                        {title}
                      </h3>

                      {/* Address */}
                      <div className="flex items-start gap-1.5 text-slate-500 text-sm md:text-base break-words">
                        <MapPin className="h-5 w-5 shrink-0" />
                        <span className="break-words leading-snug">{address}</span>
                      </div>
                    </div>

                    {/* Three-dot menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-8 w-8 rounded-full hover:bg-slate-100"
                        >
                          <EllipsisVertical className="h-5 w-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="z-[9999] w-56 rounded-xl border border-slate-200/70 bg-white p-0 shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                      >
                        <DropdownMenuItem
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none"
                          onClick={onTimeChange}
                        >
                          <Clock className="h-4 w-4 text-slate-600" />
                          <span>Change Time</span>
                        </DropdownMenuItem>
                        {onSuggestAlternative && (
                          <DropdownMenuItem
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none"
                            onClick={onSuggestAlternative}
                          >
                            <Sparkles className="h-4 w-4 text-slate-600" />
                            <span>Suggest Alternative</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Spacer to push parking and ticket to bottom */}
                  <div className="flex-1" />

                  {/* Parking Available */}
                  <div className="flex items-center justify-between py-3 border-t border-slate-200">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <ParkingCircle className="h-5 w-5 text-slate-500" />
                      <span className="text-base font-medium">
                        {parkingLoading
                          ? "Finding parking…"
                          : parkingStatus === "error"
                          ? "Parking info unavailable"
                          : parkingStatus === "not_available"
                          ? "No parking available"
                          : "Parking Available"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-base font-semibold hover:bg-transparent px-2"
                      onClick={async () => {
                        setShowParkingModal(true);
                        await fetchParking();
                        if (!selectedParkingId && parkingOptions.length > 0) {
                          setSelectedParkingId(parkingOptions[0].id);
                        }
                      }}
                    >
                      View <ChevronRight className="h-4 w-4 ml-0.5" />
                    </Button>
                  </div>
                </div>

                {/* Buy Ticket / View Details section */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                  <button
                    className="flex items-center text-pink-600 font-semibold text-lg hover:opacity-80 transition-opacity"
                    onClick={onCta}
                  >
                    {ctaKind === "ticket" ? (
                      <>
                        <Ticket className="h-5 w-5 mr-2" />
                        <span>Buy Ticket</span>
                      </>
                    ) : (
                      <>
                        <Info className="h-5 w-5 mr-2" />
                        <span>View Details</span>
                      </>
                    )}
                  </button>
                  {ctaKind === "ticket" && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Camera className="h-5 w-5 text-slate-500" />
                      <span className="text-xl font-bold">{priceText}</span>
                      <span className="text-slate-500 text-base">/person</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile layout */}
            <div className="md:hidden">
              <div className="p-4 pb-0">
                {/* Top section: Image + Title/Rating/Address */}
                <div className="flex gap-3 mb-4">
                  {/* Small image on left */}
                  <div className="relative w-28 h-28 shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="112px"
                      loading="lazy"
                      quality={75}
                    />

                    {/* Pink circular badge - top-left corner */}
                    <div className="absolute left-2 top-2 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 p-2 shadow-lg">
                      <Camera className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>

                  {/* Title, rating, address on right */}
                  <div className="flex-1 min-w-0">
                    {/* 5-star rating */}
                    <div className="flex items-center gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= Math.floor(rating);
                        const isPartiallyFilled =
                          star === Math.ceil(rating) && rating % 1 > 0;

                        return (
                          <div key={star} className="relative h-4 w-4">
                            {/* Background star (always gray) */}
                            <Star className="absolute h-4 w-4 text-slate-300" />

                            {/* Filled portion (pink) */}
                            <div
                              className="absolute top-0 left-0 overflow-hidden"
                              style={{
                                width: isFilled
                                  ? "100%"
                                  : isPartiallyFilled
                                  ? `${(rating % 1) * 100}%`
                                  : "0%",
                              }}
                            >
                              <Star className="h-4 w-4 fill-pink-500 text-pink-500" />
                            </div>
                          </div>
                        );
                      })}
                      <span className="ml-1 text-xs text-slate-500">
                        {rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">
                      {title}
                    </h3>

                    {/* Address */}
                    <div className="flex items-start gap-1.5 text-slate-500 text-xs sm:text-sm break-words">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="break-words leading-snug">{address}</span>
                    </div>
                  </div>

                  {/* Three-dot menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 rounded-full hover:bg-slate-100 -mt-1"
                      >
                        <EllipsisVertical className="h-5 w-5 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className="z-[9999] w-56 rounded-xl border border-slate-200/70 bg-white p-0 shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                    >
                      <DropdownMenuItem
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none"
                        onClick={onTimeChange}
                      >
                        <Clock className="h-4 w-4 text-slate-600" />
                        <span>Change Time</span>
                      </DropdownMenuItem>
                      {onSuggestAlternative && (
                        <DropdownMenuItem
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none"
                          onClick={onSuggestAlternative}
                        >
                          <Sparkles className="h-4 w-4 text-slate-600" />
                          <span>Suggest Alternative</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Time range row */}
                <div className="flex items-center gap-2.5 text-slate-600 py-2.5 border-t border-slate-200">
                  <Clock className="h-5 w-5 text-slate-500" />
                  <span className="text-sm font-medium">{timeRange}</span>
                </div>

                {/* Parking Available row */}
                <div className="flex items-center justify-between py-2.5 border-t border-slate-200">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <ParkingCircle className="h-5 w-5 text-slate-500" />
                    <span className="text-sm font-medium">
                      {parkingLoading
                        ? "Finding parking…"
                        : parkingStatus === "error"
                        ? "Parking info unavailable"
                        : parkingStatus === "not_available"
                        ? "No parking available"
                        : "Parking Available"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-sm font-semibold hover:bg-transparent px-2"
                    onClick={async () => {
                      setShowParkingModal(true);
                      await fetchParking();
                      if (!selectedParkingId && parkingOptions.length > 0) {
                        setSelectedParkingId(parkingOptions[0].id);
                      }
                    }}
                  >
                    View <ChevronRight className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
              </div>

              {/* Buy Ticket / View Details section */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
                <button
                  className="flex items-center text-pink-600 font-semibold text-base hover:opacity-80 transition-opacity"
                  onClick={onCta}
                >
                  {ctaKind === "ticket" ? (
                    <>
                      <Ticket className="h-5 w-5 mr-2" />
                      <span>Buy Ticket</span>
                    </>
                  ) : (
                    <>
                      <Info className="h-5 w-5 mr-2" />
                      <span>View Details</span>
                    </>
                  )}
                </button>
                {ctaKind === "ticket" && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Camera className="h-5 w-5 text-slate-500" />
                    <span className="text-lg font-bold">{priceText}</span>
                    <span className="text-slate-500 text-sm">/person</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Parking Options Modal */}
      <Dialog open={showParkingModal} onOpenChange={setShowParkingModal}>
        <DialogContent className="w-[92vw] max-w-[92vw] sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Parking Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
            {parkingLoading ? (
              <div className="text-sm text-slate-600 py-4">Finding parking…</div>
            ) : parkingOptions.length === 0 ? (
              <div className="text-sm text-slate-600">No parking options found.</div>
            ) : null}
            {parkingOptions.map((opt) => {
              const selected = selectedParkingId === opt.id;
              return (
                <button
                  key={opt.id}
                  className={`w-full flex items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                    selected ? "border-pink-400 ring-1 ring-pink-200" : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    setSelectedParkingId(opt.id);
                    onViewParking({
                      latitude: opt.latitude,
                      longitude: opt.longitude,
                      name: opt.name,
                    });
                    setShowParkingModal(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center ${
                      selected ? "ring-2 ring-pink-400" : ""
                    }`}>
                      <ParkingCircle className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{opt.name}</div>
                      <div className="text-xs text-slate-600">{opt.distance_display}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {opt.price_display || "—"}
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItineraryCard;
