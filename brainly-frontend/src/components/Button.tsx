import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullwidth?: boolean;
  loading?: boolean;
}

const varinatClasses = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-200 text-purple-600",
};

const defaultClasses = "px-4 py-2 rounded-md font-light flex items-center";

export function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`${varinatClasses[props.variant]} ${defaultClasses} ${
        props.fullwidth ? "w-full flex justify-center items-center" : ""
      } ${props.loading ? "opacity-45" : ""}   `}
      disabled={props.loading}
    >
      <div className="pr-2">{props.startIcon}</div> {props.text}
    </button>
  );
}
