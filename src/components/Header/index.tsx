import { MdOutlineDarkMode } from "react-icons/md";
import { FaGithub } from "react-icons/fa";

export default function index(): JSX.Element {
  return (
    <header>
      <div className="px-4 py-2 sm:px-12 pb-4 border">
        <nav className="bg-white">
          <div className="flex items-center justify-between mx-auto py-1">
            <div>
              <h1 className="text-primary text-2xl font-bold italic">GeoGuide</h1>
            </div>
            <div className="flex justify-between items-center gap-8">
              <FaGithub className="cursor-pointer text-black text-xl" />
              <MdOutlineDarkMode className="cursor-pointer text-black text-xl" />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
