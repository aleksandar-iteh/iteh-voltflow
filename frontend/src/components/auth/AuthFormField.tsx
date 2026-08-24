import { useState } from 'react';
import type { ChangeEventHandler, HTMLInputAutoCompleteAttribute } from 'react';

interface TextFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email';
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  autoComplete: HTMLInputAutoCompleteAttribute;
  error?: string;
  placeholder?: string;
  minLength?: number;
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  autoComplete: HTMLInputAutoCompleteAttribute;
  error?: string;
}

const baseInputClasses =
  'block w-full rounded-xl border bg-white px-4 py-3 text-sm text-teal-950 outline-none transition placeholder:text-slate-400 focus:ring-2';

export function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  error,
  placeholder,
  minLength,
}: TextFieldProps) {
  return (
    <div>
      <label className='mb-2 block text-sm font-semibold text-teal-950' htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={minLength}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${baseInputClasses} ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-teal-100 focus:border-teal-600 focus:ring-teal-100'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className='mt-2 text-sm text-red-600'>
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  error,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label className='mb-2 block text-sm font-semibold text-teal-950' htmlFor={id}>
        {label}
      </label>
      <div className='relative'>
        <input
          id={id}
          name={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
          minLength={8}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${baseInputClasses} pr-16 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-teal-100 focus:border-teal-600 focus:ring-teal-100'
          }`}
        />
        <button
          type='button'
          onClick={() => setIsVisible((visible) => !visible)}
          className='absolute inset-y-0 right-0 rounded-r-xl px-4 text-xs font-bold text-teal-700 transition hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600'
          aria-label={`${isVisible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className='mt-2 text-sm text-red-600'>
          {error}
        </p>
      )}
    </div>
  );
}
