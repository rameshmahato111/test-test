import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { IncludedList, HighlightsList, MeetingPoint } from './AccordionContent';
import { accordionData } from '@/data/dummyData';
import { CommonDetailPageData } from '@/types/details';

const AccordionSection: React.FC<{
    details: CommonDetailPageData
}> = ({
    details
}) => {
        const includedFeatures = details.extraInfo?.featureGroups.flatMap(group => group.included || []).map(feature => feature.description) || [];
        const excludedFeatures = details.extraInfo?.featureGroups.flatMap(group => group.excluded || []).map(feature => feature.description) || [];

        accordionData.included = includedFeatures;
        accordionData.notIncluded = excludedFeatures;

        const sections = [
            {
                title: "What's Included & Not Included",
                content: (
                    <div className="space-y-6">
                        <IncludedList items={accordionData.included} type="included" />
                        <IncludedList items={accordionData.notIncluded} type="not-included" />
                    </div>
                )
            },
            {
                title: "Highlights",
                content: <HighlightsList items={details.importantInfo || []} />
            },
            {
                title: "Meeting Point",
                content: (
                    <MeetingPoint
                        activityLocation={details.activityLocation}
                    />
                )
            }
        ];

        return (
            <Accordion type="single" collapsible className="w-full">
                {sections.map((section, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border-b py-2 border-gray-200"
                    >
                        <AccordionTrigger className="hover:no-underline">
                            <span className="   text-sm sm:text-base md:text-lg font-semibold text-foreground">{section.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 text-gray-600">
                            {section.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        );
    };

export default AccordionSection;
