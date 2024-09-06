import React, { ReactNode } from "react";
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
        // max-w-md w-full
        className={`
          bg-white  dark:bg-bgDark rounded-xl shadow pt-20 px-2 transition-all max-w-5xl w-full  h-[80vh] overflow-auto
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
      >
        <div className="flex justify-end absolute right-0 top-2 p-2">
          <button
            className="p-2 rounded-full bg-primary text-white shadow-sm hover:opacity-50"
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
        <div className="py-4 px-3 md:px-12">{children}</div>
      </div>
    </div>
  );
}
