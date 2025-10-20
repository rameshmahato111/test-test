import { Button } from "@/components/ui/button";

interface DateSelectorProps {
  rateDetails: Array<{
    id: number;
    operationDates: Array<{
      from: string;
      to: string;
      cancellationPolicies: Array<{
        dateFrom: string;
        amount: number;
      }>;
    }>;
    totalAmount: {
      amount: number;
    };
  }>;
  selectedDate: {
    from: string;
    to: string;
    rateDetailId?: number;
    cancellationPolicy?: any;
  };
  onDateSelect: (
    startDate: string,
    endDate: string,
    rateDetailId: number,
    policy: any
  ) => void;
}

const DateSelector = ({
  rateDetails,
  selectedDate,
  onDateSelect,
}: DateSelectorProps) => {
  if (!rateDetails || rateDetails.length === 0) {
    return (
      <div className="pb-6">
        <h4 className="text-foreground text-xl font-semibold pb-4">
          Select Date
        </h4>
        <p>No available dates found.</p>
      </div>
    );
  }

  const handleDateClick = (
    startDate: string,
    endDate: string,
    rateDetailId: number,
    policy: any,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    onDateSelect(startDate, endDate, rateDetailId, policy);
  };

  const allDates = Array.from(
    new Set(
      rateDetails.flatMap((rate) =>
        rate.operationDates.map((operationDate) =>
          JSON.stringify({
            startDate: operationDate.from,
            endDate: operationDate.to,
            rateDetailId: rate.id,
            policy: operationDate.cancellationPolicies,
          })
        )
      )
    )
  ).map((dateString) => JSON.parse(dateString));

  const formatDate = (date: string) => {
    if (!date) {
      return null;
    }
    const datastring = new Date(date);
    return datastring.toISOString().slice(0, 10);
  };

  return (
    <div className="pb-6">
      <h4 className="text-foreground text-xl font-semibold pb-4">
        Select Date
      </h4>

      {selectedDate.cancellationPolicy &&
      selectedDate.cancellationPolicy.length > 0 ? (
        <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2 text-sm text-green-700 mt-1  mb-4">
          Cancellation Charge:
          <span>
            {selectedDate.cancellationPolicy[0].amount} from{" "}
            {selectedDate.cancellationPolicy[0].dateFrom &&
              formatDate(selectedDate.cancellationPolicy[0].dateFrom)}
          </span>
        </div>
      ) : (
        <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2 text-sm text-green-700 mt-1  mb-4">
          Cancellation Charge:
          <span>free Cancellation</span>
        </div>
      )}
      <div className="flex flex-wrap gap-4">
        {allDates.map((date, index) => {
          const isSelected =
            selectedDate.from === date.startDate &&
            selectedDate.to === date.endDate &&
            selectedDate.rateDetailId === date.rateDetailId;

          return (
            <Button
              key={index}
              type="button"
              variant="outline"
              className={`
                                border border-primary-200 rounded-lg p-4 transition-all duration-200
                                ${
                                  isSelected
                                    ? "bg-primary-400 text-background border-primary-400"
                                    : "hover:bg-primary-0 hover:border-primary-400 "
                                }
                            `}
              onClick={(e) =>
                handleDateClick(
                  date.startDate,
                  date.endDate,
                  date.rateDetailId,
                  date.policy,
                  e
                )
              }
            >
              <div className="flex gap-2 items-center">
                <span className="font-medium">{date.startDate}</span>
                <span className="text-sm">to</span>
                <span className="font-medium">{date.endDate}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
