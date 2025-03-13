import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaCalendarAlt } from "react-icons/fa";
import "./DatePicker.css";

interface DatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    className?: string;
    onCalendarOpen?: () => void;
    onCalendarClose?: () => void;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({ selected, onChange, className, onCalendarOpen, onCalendarClose }) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const handleDayClick = (day: Date) => {
        onChange(day);
        setShowCalendar(false);
        if (onCalendarClose) onCalendarClose();
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
            setShowCalendar(false);
            if (onCalendarClose) onCalendarClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`custom-date-picker ${className}`} ref={datePickerRef}>
            <div className="date-input-wrapper" onClick={() => {
                setShowCalendar(!showCalendar);
                if (!showCalendar && onCalendarOpen) onCalendarOpen();
                if (showCalendar && onCalendarClose) onCalendarClose();
            }}>
                <input
                    type="text"
                    className="date-input-field"
                    value={selected ? selected.toLocaleDateString("en-GB") : ""}
                    readOnly
                />
                <FaCalendarAlt className="calendar-icon" />
            </div>
            {showCalendar && (
                <DayPicker
                    selected={selected ? { from: selected, to: selected } : undefined}
                    onDayClick={handleDayClick}
                    disabled={{ after: new Date() }} // Restrict selection to past dates
                    className="day-picker"
                />
            )}
        </div>
    );
};

export default CustomDatePicker;
