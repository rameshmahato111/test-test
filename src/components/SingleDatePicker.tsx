import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type DateFormat = 'short' | 'medium' | 'full' | 'custom';

interface SingleDatePickerProps {
    onDateChange: (date: Date | null) => void;
    selectedDate: Date | null;
    placeholder?: string;
    dateFormat?: DateFormat;
    customFormat?: (date: Date) => string;
    className?: string;
}

const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
    onDateChange,
    selectedDate,
    placeholder = 'Select Date',
    dateFormat = 'short',
    customFormat,
    className
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [open, setOpen] = useState(false);

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const handleDateClick = useCallback((day: number) => {
        const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        clickedDate.setHours(12, 0, 0, 0);

        const today = new Date();
        today.setHours(12, 0, 0, 0);

        if (clickedDate < today) return;
        onDateChange(clickedDate);
        setOpen(false);
    }, [currentMonth, onDateChange]);

    const renderCalendar = useCallback(() => {
        const days = [];
        const today = new Date();
        today.setHours(12, 0, 0, 0);

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            date.setHours(12, 0, 0, 0);

            const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
            const isToday = date.getTime() === today.getTime();
            const isPastDate = date < today;

            days.push(
                <Button
                    key={day}
                    variant="ghost"
                    onClick={() => handleDateClick(day)}
                    disabled={isPastDate}
                    className={`w-10 h-10 rounded-full text-gray-700
                        ${isSelected ? 'bg-primary-400 text-background' : ''}
                        ${isToday ? 'border-2 border-primary-400' : ''}
                        ${isPastDate ? 'text-gray-400 cursor-not-allowed' : ''}
                    `}
                >
                    {day}
                </Button>
            );
        }
        return days;
    }, [currentMonth, selectedDate, daysInMonth, firstDayOfMonth, handleDateClick]);

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().split('T')[0];
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full pl-2 justify-start items-center font-inter font-medium", className)}>
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {selectedDate ? (
                        <p className='text-sm'>{formatDate(selectedDate)}</p>
                    ) : (
                        <span className='text-sm text-gray-500'>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background" align="start">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <Button
                            variant="ghost"
                            className='focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background p-0 h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200'
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        >
                            <ChevronLeft className='w-4 h-4' />
                        </Button>
                        <span className='text-foreground font-medium text-base font-inter'>
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <Button
                            variant="ghost"
                            className='p-0 h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200'
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        >
                            <ChevronRight className='w-4 h-4' />
                        </Button>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                            <div key={index} className="text-center font-medium text-gray-400">{day}</div>
                        ))}
                        {renderCalendar()}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default SingleDatePicker;
