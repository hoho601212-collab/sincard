import * as React from 'react';

import { cn } from '../../lib/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        '[&:-webkit-autofill]:!bg-transparent [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill:active]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_white]',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
