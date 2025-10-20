import React from 'react';
import RatingDetails from './RatingDetails';
import { useAuth } from '@/hooks/useAuth';
import { RecommendationAPI } from '@/services/api/recommendation';

const RatingSection = ({ id, type }: { id: string, type: string }) => {

    const { token } = useAuth();
    // if (type && id && token) {
    //     RecommendationAPI.sendFeedback(Number(id), type as "hotel" | "activity", "read", token!);
    // }

    return (
        <div>
            <RatingDetails id={id} type={type} />
        </div>
    );
};

export default RatingSection;
