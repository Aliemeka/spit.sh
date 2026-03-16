import React, { useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string | number;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  value,
  name,
  label,
  className,
  onChange,
  ...props
}) => {
  const id = useId();
  return (
    <div>
      <label className='font-medium' htmlFor={name || id}>
        {label}
      </label>
      <input
        id={name || id}
        name={name}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full mt-2 px-3 py-2 dark:bg-gray-800 dark:text-white bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg focus:ring-offset-2 focus:ring-offset-transparent focus:ring-1 focus:ring-fuchsia-200 focus:shadow-lg focus:shadow-fuchsia-400/50",
          className,
        )}
        {...props}
      />
    </div>
  );
};

export default Input;
