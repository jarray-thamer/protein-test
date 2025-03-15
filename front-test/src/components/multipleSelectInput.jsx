import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";

export const MultiSelectDropdown = ({
  selected = [], // Add default value
  onChange,
  placeholder = "Select options", // Add default value
  options = [], // Add default value
  isLoading = false, // Add default value
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper functions for getting option properties
  const getOptionValue = (option) => option?.value || option?._id;
  const getOptionLabel = (option) => option?.label || option?.designation;

  // Handle empty or loading states
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="px-2 py-1 text-sm text-muted-foreground">
          Loading...
        </div>
      );
    }

    if (!options || options.length === 0) {
      return (
        <div className="px-2 py-1 text-sm text-muted-foreground">
          No options available
        </div>
      );
    }

    return options.map((option) => {
      const value = getOptionValue(option);
      const label = getOptionLabel(option);

      if (!value || !label) return null;

      return (
        <div
          key={value}
          onClick={() => toggleOption(value)}
          className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer ${
            selected.includes(value) ? "bg-muted" : "hover:bg-muted"
          }`}
        >
          <span>{label}</span>
          {selected.includes(value) && (
            <CheckIcon className="w-4 h-4 text-primary" />
          )}
        </div>
      );
    });
  };

  const toggleOption = (value) => {
    if (!value) return;

    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  // Get selected options' labels for the button text
  const getSelectedLabels = () => {
    if (!selected || selected.length === 0) return placeholder;

    if (selected.length === 1) {
      const option = options.find((opt) => getOptionValue(opt) === selected[0]);
      return option ? getOptionLabel(option) : placeholder;
    }

    return `${selected.length} items selected`;
  };

  return (
    <div className="space-y-3">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between w-full"
          >
            <span className="truncate">{getSelectedLabels()}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform flex-shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2 space-y-1">
          {renderContent()}
        </PopoverContent>
      </Popover>

      {/* Selected Options */}
      {selected && selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((value) => {
            const option = options.find((opt) => getOptionValue(opt) === value);
            if (!option) return null;

            return (
              <Badge
                key={value}
                variant="secondary"
                className="flex items-center gap-1 text-sm font-normal"
              >
                {getOptionLabel(option)}
                <XIcon
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(value);
                  }}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
