"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useState } from "react";

export function DateRangePicker() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    // Logic to apply the date range (e.g., fetch data based on the selected range)
    console.log("Applied date range:", date);
    setIsOpen(false); // Close the popover
  };

  const handleCancel = () => {
    setIsOpen(false); // Close the popover without applying changes
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={handleCancel} className="mr-2">
            Cancel
          </Button>
          <Button variant="default" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
