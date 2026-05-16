import { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children?: ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  icon,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className='inline-flex items-center rounded-full bg-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white gap-x-1.5 hover:bg-fuchsia-700 focus:outline-none focus:ring active:bg-fuchsia-800 transition'
    >
      {children}
      {icon && icon}
    </button>
  );
};

export default PrimaryButton;
