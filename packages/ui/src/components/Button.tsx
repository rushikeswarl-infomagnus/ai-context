import type { ReactNode } from 'react';

export type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
};

export const Button = ({ label, variant = 'primary', disabled = false, onClick }: ButtonProps): JSX.Element => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
