import React from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'outline';

interface CommonProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const BASE_STYLES =
  'px-6 py-3 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-sm flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 focus-visible:outline-rose-600',
  secondary:
    'bg-amber-100 text-amber-900 hover:bg-amber-200 focus-visible:outline-amber-600',
  // Used for newsletter section
  accent:
    'bg-amber-400 text-amber-950 hover:bg-amber-300 focus-visible:outline-white',
  outline:
    'border-2 border-rose-500 text-rose-600 hover:bg-rose-50 focus-visible:outline-rose-600',
};

const buildClasses = (variant: Variant = 'primary', className = '') =>
  `${BASE_STYLES} ${VARIANTS[variant]} ${className}`.trim();

export const Button: React.FC<ButtonProps> = (props) => {
  if (props.href !== undefined) {
    const { variant, children, className, ...anchorProps } = props;
    return (
      <a className={buildClasses(variant, className)} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { variant, children, className, type = 'button', ...buttonProps } = props;
  return (
    <button type={type} className={buildClasses(variant, className)} {...buttonProps}>
      {children}
    </button>
  );
};