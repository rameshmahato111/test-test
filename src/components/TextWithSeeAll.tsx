import Link from "next/link";
import React from "react";

const TextWithSeeAll = ({
  title,
  seeAllUrl,
  showSeeAll = true,
}: {
  title: string;
  seeAllUrl?: string;
  showSeeAll?: boolean;
}) => {
  return (
    <div className="  flex items-center justify-between">
      <h2 className="text-xl md:text-3xl font-semibold text-foreground">
        {title}
      </h2>
      {showSeeAll && (
        <Link
          prefetch={false}
          href={`/all/${seeAllUrl}`}
          className="text-base font-medium hover:text-primary-400/80 transition-all duration-300 text-primary-400 transform hover:scale-100 hover:translate-x-1"
        >
          See all
        </Link>
      )}
    </div>
  );
};

export default TextWithSeeAll;
