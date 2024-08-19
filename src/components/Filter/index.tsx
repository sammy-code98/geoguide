/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "react-select";
import { filterOptions } from "./data";

interface FilterI {
  value: string;
  onRegionChange: (region: string) => void;
}
const customStyles = {
  control: (base: any) => ({
    ...base,
    boxShadow: "none",
    "&:hover": {
      border: "none",
    },
    border: "none",
  }),
};
export default function Index({ onRegionChange, value }: FilterI): JSX.Element {
  const handleRegionChange = (option: any) => {
    onRegionChange(option.value);
  };
  const selectedOption = filterOptions.find((option) => option.value === value);

  return (
    <div className="max-w-xl">
      <Select
        className="p-2 text-sm md:text-md text-textGray shadow-md rounded bg-white"
        placeholder="Filter by region..."
        options={filterOptions}
        value={selectedOption}
        onChange={handleRegionChange}
        styles={customStyles}
      />
    </div>
  );
}
