import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string | number;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ value, onChange, ...props }) => {
  return (
    <div>
      <label className='font-medium'>Email</label>
      <input
        value={value}
        onChange={onChange}
        className='w-full mt-2 px-3 py-2 dark:bg-gray-800 dark:text-white bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg focus:ring-offset-2 focus:ring-offset-transparent focus:ring-1 focus:ring-fuchsia-200 focus:shadow-lg focus:shadow-fuchsia-400/50'
        {...props}
      />
    </div>
  );
};

export default Input;
