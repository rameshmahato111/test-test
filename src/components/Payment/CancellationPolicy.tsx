import React from "react";
import { Check } from "lucide-react";
import { formatNumberWithCommas } from "@/utils";

interface CancellationPolicyProps {
  cancellation: any;
  amount: number;
  currency: string;
}

const CancellationPolicy: React.FC<CancellationPolicyProps> = ({
  cancellation,
  amount,
  currency,
}) => {
  if (!cancellation) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center gap-2 rounded-lg bg-[rgba(26,192,87,0.10)] px-3 py-2 mb-4">
      {cancellation && (
        <div className="border rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Cancellation Policy
          </h4>
          <div className="space-y-3">
            {cancellation.map((policy: any, index: any) => (
              <div
                key={index}
                className="flex justify-between text-sm border-b pb-2 last:border-0"
              >
                <span className="text-gray-600">
                  {policy.from ? formatDate(policy.from) : "Now"} -{" "}
                  {policy.to ? formatDate(policy.to) : "Check-in"}
                </span>
                <span className="font-medium ml-4">
                  {formatNumberWithCommas(parseFloat(policy.amount))} {currency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CancellationPolicy;
