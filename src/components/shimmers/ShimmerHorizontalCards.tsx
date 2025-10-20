import HorizontalCardScroll from "../HorizontalCardScroll";
import ShimmerCard from "./ShimmerCard";

export default function ShimmerHorizontalCards() {
    return (<HorizontalCardScroll>
        {[1, 2, 3, 4, 5].map((each) => {
            return <ShimmerCard key={each} className="w-[295px]" />
        })}
    </HorizontalCardScroll>);
}

