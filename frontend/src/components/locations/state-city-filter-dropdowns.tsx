import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const ALL_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const ALL_CITIES = [
  "Ahmedabad",
  "Bengaluru",
  "Bhopal",
  "Bhubaneswar",
  "Chandigarh",
  "Chennai",
  "Delhi",
  "Gurugram",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Kolkata",
  "Lucknow",
  "Ludhiana",
  "Mumbai",
  "Nagpur",
  "Noida",
  "Patna",
  "Pune",
  "Surat",
  "Thane",
  "Vadodara",
  "Visakhapatnam",
];

export const ALL_LOCATIONS = [
  "Demo Store 371",
  "Demo Store 312",
  "Demo Store 304",
  "Demo Store 42",
  "Demo Store 100",
  "Demo Store 101",
  "Demo Store 102",
  "Demo Store 103",
  "Demo Store 104",
  "Demo Store 127",
  "Demo Store 296",
  "Demo Store 310",
];

export const ALL_KEYWORDS = [
  "footwear shop near me",
  "ladies shoes",
  "men shoes",
  "shoe shop near me",
  "sports shoes",
];

interface FilterDropdownProps {
  title: string;
  defaultLabel: string;
  pluralLabel: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  searchPlaceholder?: string;
  minWidth?: string;
}

export function MultiSelectFilterDropdown({
  title,
  defaultLabel,
  pluralLabel,
  options,
  selectedValues,
  onChange,
  searchPlaceholder = "Search...",
  minWidth = "min-w-[150px]",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [tempValues, setTempValues] = useState<string[]>(selectedValues);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTempValues(selectedValues);
      setSearch("");
    }
  };

  const handleApply = () => {
    onChange(tempValues);
    setOpen(false);
  };

  const getLabel = () => {
    if (selectedValues.length === 0 || selectedValues.length === options.length) {
      return defaultLabel;
    }
    if (selectedValues.length === 1) {
      return selectedValues[0];
    }
    return `${selectedValues.length} ${pluralLabel}`;
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className={`h-8 px-3 rounded-md bg-card dark:bg-[#121214] border border-border hover:border-muted-foreground/40 text-xs font-semibold text-foreground flex items-center justify-between gap-2 ${minWidth} cursor-pointer transition-colors shadow-sm`}>
          <span className="truncate">{getLabel()}</span>
          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-56 p-3 bg-popover dark:bg-[#121214] border border-border text-popover-foreground shadow-2xl rounded-xl space-y-3"
      >
        <div className="flex items-center justify-between border-b border-border pb-1.5">
          <p className="text-[11px] font-bold text-blue-500">{title}</p>
          {tempValues.length > 0 && (
            <button
              type="button"
              onClick={() => setTempValues([])}
              className="text-[10px] text-muted-foreground hover:text-blue-400 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Input */}
        {options.length > 5 && (
          <div className="relative">
            <Search className="size-3 text-muted-foreground absolute left-2 top-2 pointer-events-none" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 pl-7 text-xs bg-background border border-border text-foreground focus:border-blue-500 focus-visible:ring-0"
            />
          </div>
        )}

        {/* Checkbox List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {filteredOptions.length === 0 ? (
            <p className="text-[11px] text-muted-foreground py-2 text-center">No options found</p>
          ) : (
            filteredOptions.map((opt) => {
              const checked = tempValues.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:text-blue-400 select-none"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(isCheck) => {
                      if (isCheck) {
                        setTempValues((prev) => [...prev, opt]);
                      } else {
                        setTempValues((prev) => prev.filter((s) => s !== opt));
                      }
                    }}
                    className="border-border data-[state=checked]:bg-blue-500 data-[state=checked]:text-white dark:data-[state=checked]:text-black"
                  />
                  <span className="truncate">{opt}</span>
                </label>
              );
            })
          )}
        </div>

        <Button
          size="sm"
          onClick={handleApply}
          className="w-full h-7 bg-secondary hover:bg-blue-500 hover:text-black text-secondary-foreground text-xs font-bold rounded cursor-pointer transition-colors"
        >
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export function StateFilterDropdown({
  selectedStates,
  onChange,
  options = ALL_STATES,
}: {
  selectedStates: string[];
  onChange: (states: string[]) => void;
  options?: string[];
}) {
  return (
    <MultiSelectFilterDropdown
      title="State"
      defaultLabel="All States"
      pluralLabel="States"
      options={options}
      selectedValues={selectedStates}
      onChange={onChange}
      searchPlaceholder="Search state..."
    />
  );
}

export function CityFilterDropdown({
  selectedCities,
  onChange,
  options = ALL_CITIES,
}: {
  selectedCities: string[];
  onChange: (cities: string[]) => void;
  options?: string[];
}) {
  return (
    <MultiSelectFilterDropdown
      title="City"
      defaultLabel="All Cities"
      pluralLabel="Cities"
      options={options}
      selectedValues={selectedCities}
      onChange={onChange}
      searchPlaceholder="Search city..."
    />
  );
}

export function LocationFilterDropdown({
  selectedLocations,
  onChange,
  options = ALL_LOCATIONS,
}: {
  selectedLocations: string[];
  onChange: (locations: string[]) => void;
  options?: string[];
}) {
  return (
    <MultiSelectFilterDropdown
      title="Location"
      defaultLabel="All Locations"
      pluralLabel="Locations"
      options={options}
      selectedValues={selectedLocations}
      onChange={onChange}
      searchPlaceholder="Search location..."
    />
  );
}

export function KeywordFilterDropdown({
  selectedKeywords,
  onChange,
  options = ALL_KEYWORDS,
}: {
  selectedKeywords: string[];
  onChange: (keywords: string[]) => void;
  options?: string[];
}) {
  return (
    <MultiSelectFilterDropdown
      title="Keywords"
      defaultLabel="All Keywords"
      pluralLabel="Keywords"
      options={options}
      selectedValues={selectedKeywords}
      onChange={onChange}
      searchPlaceholder="Search keyword..."
    />
  );
}

