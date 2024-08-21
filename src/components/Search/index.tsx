import { IoSearch } from "react-icons/io5";

interface SearchI {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function index({ value, onChange }: SearchI): JSX.Element {
  return (
    <div className="w-full md:w-6/12">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <IoSearch className="cursor-pointer text-textGray text-sm md:text-xl" />
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search for countries by name or capital..."
          className="block w-full px-3 py-4  ps-7 md:ps-10 text-sm md:text-md text-textGray  dark:text-textWhite shadow-md rounded bg-white dark:bg-bgDark focus:ring-none focus:outline-0 focus:border-none"
        />
      </div>
    </div>
  );
}
