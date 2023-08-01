import { twMerge } from "tailwind-merge";

import { useToasterContext, Toast } from "../contexts/Toaster";

type Props = {
  type: Toast["type"];
};

export const Button = ({ type }: Props) => {
  const { addToast } = useToasterContext();

  return (
    <button
      className="px-4 py-3 w-full text-gray-600 rounded-md border border-gray-200 sm:w-auto"
      onClick={() => {
        addToast({ type: type, text: `Hi, I'm a ${type} toast` });
      }}
    >
      Show{" "}
      <span
        className={twMerge(
          "font-semibold",
          type === "info" && "text-sky-600",
          type === "warning" && "text-yellow-600",
          type === "error" && "text-red-600",
          type === "success" && "text-green-600"
        )}
      >
        {type}
      </span>{" "}
      toast
    </button>
  );
};
