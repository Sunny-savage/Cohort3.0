import { forwardRef } from "react";

interface InputProps {
  onChange?: () => void;
  placeholder?: string;
}

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, placeholder }: InputProps, ref) => {
    return (
      <div>
        <input
          type="text"
          className="px-4 py-2 border rounded-sm m-2"
          onChange={onChange}
          placeholder={placeholder}
          ref={ref}
        />
      </div>
    );
  }
);

export default InputComponent;
