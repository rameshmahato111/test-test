import { ActivityLocation } from '@/schemas/activities';
import { CheckIcon, MapPin, XIcon } from 'lucide-react';
import React from 'react';
interface CheckmarkIconProps {
    type: 'check' | 'cross';
}

const CheckmarkIcon: React.FC<CheckmarkIconProps> = ({ type }) => {
    if (type === 'check') {
        return (
            <CheckIcon className='w-4 h-4' />
        );
    }
    return (
        <XIcon className='w-4 h-4' />
    );
};

interface IncludedListProps {
    items: string[];
    type: 'included' | 'not-included';
}

const IncludedList: React.FC<IncludedListProps> = ({ items, type }) => {
    return (
        <div className="space-y-4">
            <h4 className="font-medium text-sm md:text-base text-gray-800">{type === 'included' ? "What's Included" : "What's not included"}</h4>
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <li key={index} className="font-normal text-sm md:text-base text-gray-800 flex items-center gap-2">
                        <CheckmarkIcon type={type === 'included' ? 'check' : 'cross'} />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface HighlightsListProps {
    items: string[];
}

const HighlightsList: React.FC<HighlightsListProps> = ({ items }) => {
    return (
        <ul className="space-y-3 !list-disc">
            {items.map((item, index) => (
                <li dangerouslySetInnerHTML={{ __html: item }} className='text-sm md:text-base  text-gray-800 font-normal' key={index}></li>
            ))}
        </ul>
    );
};


const MeetingPoint: React.FC<any> = ({ activityLocation }: { activityLocation: ActivityLocation }) => {
    return (
        <div className="space-y-6">

            {activityLocation.startingPoints.length > 0 && activityLocation.startingPoints.map((startingPoint, index) => (
                <div key={index} className='border-b pb-4' >

                    <div className="space-y-2 pb-4 ">
                        <h4 className="text-sm md:text-base font-medium  text-gray-800">Starting Point</h4>
                        <div className="flex items-start gap-2">
                            <MapPin className='w-4 h-4' />
                            <span className="text-sm text-gray-800">{startingPoint.meetingPoint.description}</span>
                        </div>

                    </div>
                    {startingPoint.pickupInstructions && startingPoint.pickupInstructions.length > 0 && startingPoint.pickupInstructions.map((instruction, index) => (
                        <div key={index} className='pt-4 space-y-2' >
                            <h4 className="text-sm md:text-base  font-medium text-gray-800">Pickup Instructions</h4>
                            <p className="text-sm text-gray-800">{instruction.description}</p>
                        </div>
                    ))}
                </div>
            ))}


            {activityLocation.endPoints.length > 0 && activityLocation.endPoints.map((endPoint, index) => (
                <div key={index} className="space-y-2">
                    <h4 className="text-sm md:text-base font-medium  text-gray-800">End Point</h4>
                    <div className="flex items-start gap-2">
                        <MapPin className='w-4 h-4' />
                        <span className="text-sm text-gray-800">{endPoint.description}</span>
                    </div>

                </div>

            ))}
        </div>
    );
};

export { IncludedList, HighlightsList, MeetingPoint }; 