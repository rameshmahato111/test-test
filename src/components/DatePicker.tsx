import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';

interface DatePickerProps {
    onDateChange: (startDate: Date | null, endDate: Date | null) => void;
    startDate: Date | null;
    endDate: Date | null;
    placeholderFirst?: string;
    placeholderSecond?: string;
    singleDate?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange, startDate, endDate, placeholderFirst = 'Check In', placeholderSecond = 'Check Out', singleDate = false }) => {

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [open, setOpen] = useState(false);

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const handleDateClick = useCallback((day: number) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        selectedDate.setHours(12, 0, 0, 0);

        const today = new Date();
        today.setHours(12, 0, 0, 0);

        if (selectedDate < today) return;

        if (singleDate) {
            onDateChange(selectedDate, null);
            setOpen(false);
        } else {
            if (!startDate || (startDate && endDate) || selectedDate < startDate) {
                onDateChange(selectedDate, null);
            } else {
                onDateChange(startDate, selectedDate);
                setOpen(false); // Close the popover when a complete range is selected
            }
        }
    }, [currentMonth, startDate, endDate, onDateChange, singleDate]);

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

            const isSelected = (startDate && date.toDateString() === startDate.toDateString()) ||
                (endDate && date.toDateString() === endDate.toDateString());
            const isInRange = startDate && endDate && date > startDate && date < endDate;
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
                        ${isInRange ? 'bg-primary-100' : ''}
                        ${isToday ? 'border-2 border-primary-400' : ''}
                        ${isPastDate ? 'text-gray-400 cursor-not-allowed' : ''}
                    `}
                >
                    {day}
                </Button>
            );
        }
        return days;
    }, [currentMonth, startDate, endDate, daysInMonth, firstDayOfMonth, handleDateClick]);

    // Helper function to format date to YYYY-MM-DD
    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        const displayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        displayDate.setHours(12, 0, 0, 0);
        return displayDate.toISOString().split('T')[0];
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className=''>
                <Button variant="outline" className="w-full pl-2 justify-start items-center font-inter font-medium" onClick={() => setOpen(true)}>
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {startDate ? (
                        <p className='text-sm'>{formatDate(startDate)}</p>
                    ) : (
                        <span className='text-sm text-gray-500'>{singleDate ? 'When' : placeholderFirst}</span>
                    )}
                    {!singleDate && (
                        endDate ? (
                            <p className='text-sm'>- {formatDate(endDate)}</p>
                        ) : (
                            <span className='text-sm text-gray-500'>- {" "}{placeholderSecond}</span>
                        )
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background" align="start">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <Button variant="ghost" className='focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background p-0 h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200' onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
                            <ChevronLeft className='w-4 h-4' />
                        </Button>
                        <span className='text-foreground font-medium text-base font-inter'>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <Button variant="ghost" className='p-0 h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200' onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
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

export default DatePicker;