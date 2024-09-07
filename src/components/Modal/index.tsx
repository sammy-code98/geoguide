import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  onClose: () => void;
  open: boolean;
  country: string;
  children: ReactNode;
}

export default function Modal({
  onClose,
  open,
  country,
  children,
}: ModalProps): JSX.Element {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center ${
        open ? "bg-black bg-opacity-50" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white  dark:bg-bgDark rounded-xl shadow pt-20 px-2 transition-all max-w-5xl w-full h-full overflow-y-auto
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
      >
        <div className="float-right">
          <button
            className="p-2 rounded-full  text-primary shadow-sm hover:opacity-50"
            onClick={onClose}
          >
            <IoMdClose />
          </button>
        </div>
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-center tracking-light text-black dark:text-textWhite">
            Facts you need to know about {country}
          </h2>
        </div>
        <div className="py-4 px-3 md:px-12 h-[80vh] overflow-y-auto">
          {children}
        </div>
        <div className="absolute bottom-0 left-0 w-full text-center">
          <div className="py-2">
            <p className="text-lg text-black dark:text-textWhite font-semibold">
              Powered by{" "}
              <span className="text-lg bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                <a
                  href="https://cohere.com/"
                  target="_blank"
                  className="font-bold underline decoration-primary"
                >
                  Cohere AI
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
