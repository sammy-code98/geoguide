/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "react-select";
import { filterOptions } from "./data";

interface FilterI {
  value: string;
  onRegionChange: (region: string) => void;
}
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "46px",
    backgroundColor: "rgb(var(--surface))",
    borderColor: state.isFocused ? "rgb(var(--primary))" : "rgb(var(--border))",
    boxShadow: state.isFocused ? "0 0 0 2px rgb(var(--ring) / 0.4)" : "none",
    borderRadius: "10px",
    "&:hover": { borderColor: "rgb(var(--border))" },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "rgb(var(--surface))",
    border: "1px solid rgb(var(--border))",
    borderRadius: "10px",
    overflow: "hidden",
    zIndex: 20,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgb(var(--primary))"
      : state.isFocused
        ? "rgb(var(--surface-2))"
        : "transparent",
    color: state.isSelected ? "rgb(var(--primary-foreground))" : "rgb(var(--fg))",
  }),
  singleValue: (base: any) => ({ ...base, color: "rgb(var(--fg))" }),
  input: (base: any) => ({ ...base, color: "rgb(var(--fg))" }),
  placeholder: (base: any) => ({ ...base, color: "rgb(var(--muted))" }),
};
export default function Filter({ onRegionChange, value }: FilterI): JSX.Element {
  const handleRegionChange = (option: any) => {
    onRegionChange(option.value);
  };
  const selectedOption = filterOptions.find((option) => option.value === value);

  return (
    <div className="max-w-xl">
      <label htmlFor="region-filter" className="sr-only">
        Filter countries by region
      </label>
      <Select
        inputId="region-filter"
        aria-label="Filter countries by region"
        className="text-sm md:text-base"
        placeholder="Filter by region…"
        options={filterOptions}
        value={selectedOption}
        onChange={handleRegionChange}
        styles={customStyles}
      />
    </div>
  );
}
