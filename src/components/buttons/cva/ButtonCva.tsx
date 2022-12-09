import { cva, type VariantProps } from 'cva';

const button = cva('button', {
  variants: {
    variant: {
      primary: [
        'bg-transparent',
        'text-primary-300',
        'border-[1px]',
        'border-primary-300',
        'hover:bg-primary-400',
        'hover:text-white',
      ],
      secondary: [
        'bg-transparent',
        'text-neutral-400',
        'border-toned/10',
        'border-[1px]',
        'hover:border-[1px]',
        'hover:border-toned/10',
        'hover:bg-toned/10',
        'hover:text-neutral-500',
      ],
    },
    size: {
      small: ['text-sm', 'py-1', 'px-2'],
      medium: ['text-base', 'py-2', 'px-4'],
    },
  },
  compoundVariants: [
    { variant: 'primary', size: 'medium', className: 'font-medium' },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const CvaButton: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  ...props
}) => (
  <button
    className={button({ variant, size, className })}
    {...props}
  />
);
