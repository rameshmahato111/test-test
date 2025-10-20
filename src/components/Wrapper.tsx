import { cn } from "@/lib/utils";
import React from "react";

const Wrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("max-w-[1440px] w-full mx-auto", className)}>
      {children}
    </div>
  );
};

export default Wrapper;
