// src/components/ui/FormField.tsx
import React from 'react';

const BASE =
  'w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-2 focus:outline-offset-1 focus:outline-rose-500';

interface OwnProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

interface WrapperProps extends OwnProps {
  required?: boolean;
  children: React.ReactNode;
}

const FieldWrapper: React.FC<WrapperProps> = ({ id, label, error, hint, required, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-800">
      {label}
      {required && (
        <span aria-hidden="true" className="text-rose-500">
          {' '}
          *
        </span>
      )}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
        {error}
      </p>
    ) : hint ? (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
        {hint}
      </p>
    ) : null}
  </div>
);

const describe = ({ id, error, hint }: OwnProps) => ({
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});

const border = (error?: string) => (error ? 'border-rose-400' : 'border-slate-200');

export const Field: React.FC<OwnProps & React.InputHTMLAttributes<HTMLInputElement>> = ({
  id,
  label,
  error,
  hint,
  className = '',
  ...rest
}) => (
  <FieldWrapper id={id} label={label} error={error} hint={hint} required={rest.required}>
    <input
      id={id}
      className={`${BASE} ${border(error)} ${className}`}
      {...describe({ id, label, error, hint })}
      {...rest}
    />
  </FieldWrapper>
);

export const TextAreaField: React.FC<OwnProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  id,
  label,
  error,
  hint,
  className = '',
  ...rest
}) => (
  <FieldWrapper id={id} label={label} error={error} hint={hint} required={rest.required}>
    <textarea
      id={id}
      rows={4}
      className={`${BASE} ${border(error)} resize-y ${className}`}
      {...describe({ id, label, error, hint })}
      {...rest}
    />
  </FieldWrapper>
);

export const SelectField: React.FC<OwnProps & React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  id,
  label,
  error,
  hint,
  className = '',
  children,
  ...rest
}) => (
  <FieldWrapper id={id} label={label} error={error} hint={hint} required={rest.required}>
    <select
      id={id}
      className={`${BASE} ${border(error)} cursor-pointer ${className}`}
      {...describe({ id, label, error, hint })}
      {...rest}
    >
      {children}
    </select>
  </FieldWrapper>
);