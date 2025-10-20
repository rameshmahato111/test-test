"use client";
import Wrapper from "@/components/Wrapper";
import Image from "next/image";
import React, { useEffect } from "react";
import successImage from "../../../../public/images/payment-success.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/services/api";
import { getHeaders } from "@/services/headers";
import { useAuth } from "@/hooks/useAuth";

const page = () => {
  const searchParams = useSearchParams();
  const booking_id = searchParams.get("booking_id");
  const { token } = useAuth();
  const [data, setData] = React.useState<any>({});
  const getBookingDetail = async () => {
    const response = await fetch(
      `${API_BASE_URL}/core/activity/booking/${booking_id}/`,
      {
        method: "GET",
        headers: getHeaders(token!),
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error("Failed to fetch booking details");
    }
  };
  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
    });
    if (!booking_id) {
      return;
    }
  }, []);
  useEffect(() => {
    if (!token || !booking_id) return;
    // Check if booking_id is present{
    // Fetch booking details
    const fetchBookingDetail = async () => {
      try {
        const data = await getBookingDetail();
        setData(data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
    fetchBookingDetail();
  }, [booking_id, token]);

  const parseCommentText = (text: string) => {
    return text.split("//").map((item) => {
      const [label, ...rest] = item.trim().split(":");
      return {
        label: label?.trim(),
        value: rest.join(":").trim(),
      };
    });
  };
  return (
    <Wrapper className="min-h-[80vh] flex items-center justify-center">
      <div className="flex my-10 p-4 md:p-8 bg-green-50 text-center flex-col items-center justify-center  max-w-[580px] mx-auto rounded-[20px] shadow-cardShadow">
        <Image
          src={successImage}
          alt="Payment Successful"
          width={100}
          height={100}
        />
        <h1 className=" text-lg sm:text-xl md:text-2xl text-gray-800 font-semibold pt-6">
          Your Payment has been Sucessfull
        </h1>
        <p className="text-gray-800 text-xs sm:text-sm md:text-base font-normal py-4">
          Thank you for your payment. Check your email for your booking details.
        </p>

        {/* Contract Remark */}
        <div>
          {data?.extras?.activity_info?.[0]?.comments?.map(
            (cmt: any, index: number) => {
              const parsed = parseCommentText(cmt.text);
              return (
                <div
                  key={`${index}-${cmt.type}`}
                  className="text-left w-full mt-4"
                >
                  <h3 className="text-base font-semibold text-gray-700 mb-2 capitalize">
                    {cmt.type.replace("_", " ")}
                  </h3>
                  <div className="space-y-2">
                    {parsed.map(({ label, value }, idx) => (
                      <div key={idx}>
                        <p className="text-sm font-medium text-gray-800">
                          {label}
                        </p>
                        <p className="text-sm text-gray-600">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className=" flex flex-col md:flex-row gap-4 w-[80%] pt-6">
          <Button
            asChild
            className="w-full bg-primary-400 font-semibold text-white hover:bg-primary-500 duration-300"
          >
            <Link prefetch={false} href="/bookings">
              My Bookings
            </Link>
          </Button>
          <Button
            asChild
            className=" w-full border border-primary-400 text-primary-400 hover:bg-primary-500 hover:text-white duration-300"
          >
            <Link prefetch={false} href="/">
              {" "}
              Home
            </Link>
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
