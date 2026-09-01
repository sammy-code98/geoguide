import { IoSearch } from "react-icons/io5";

interface SearchI {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function Search({ value, onChange }: SearchI): JSX.Element {
  return (
    <div className="w-full md:w-6/12" role="search">
      <label htmlFor="country-search" className="sr-only">
        Search for countries by name or capital
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <IoSearch aria-hidden="true" className="text-muted text-lg" />
        </div>
        <input
          id="country-search"
          type="search"
          value={value}
          onChange={onChange}
          placeholder="Search countries by name or capital…"
          className="block w-full ps-10 pe-3.5 py-3 text-sm md:text-base bg-surface text-fg placeholder:text-muted border border-border rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary"
        />
      </div>
    </div>
  );
}
