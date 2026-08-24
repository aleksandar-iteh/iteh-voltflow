import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthPageShell, PasswordField, TextField } from '../components/auth';
import { useAuth } from '../context';

const Register = () => {
  const {
    register,
    clearError,
    error,
    validationErrors,
    isLoading,
  } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [confirmationError, setConfirmationError] = useState<string | undefined>();

  useEffect(() => {
    clearError();

    return clearError;
  }, [clearError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmationError(undefined);

    if (password !== passwordConfirmation) {
      setConfirmationError('The password confirmation does not match.');
      return;
    }

    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate('/', { replace: true });
    } catch {
      return;
    }
  };

  return (
    <AuthPageShell
      eyebrow='Join VoltFlow'
      title='Create your account'
      description='Set up your account in a minute and start finding the right electric scooter for you.'
    >
      <form className='space-y-5' onSubmit={handleSubmit}>
        {error && (
          <div
            className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
            role='alert'
          >
            {error}
          </div>
        )}

        <TextField
          id='name'
          label='Full name'
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete='name'
          placeholder='Your full name'
          error={validationErrors.name?.[0]}
        />

        <TextField
          id='email'
          label='Email address'
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete='email'
          placeholder='you@example.com'
          error={validationErrors.email?.[0]}
        />

        <PasswordField
          id='password'
          label='Password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete='new-password'
          error={validationErrors.password?.[0]}
        />

        <PasswordField
          id='password_confirmation'
          label='Confirm password'
          value={passwordConfirmation}
          onChange={(event) => {
            setPasswordConfirmation(event.target.value);
            setConfirmationError(undefined);
          }}
          autoComplete='new-password'
          error={confirmationError}
        />

        <p className='text-xs leading-5 text-slate-500'>
          Your password must contain at least 8 characters.
        </p>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className='mt-7 text-center text-sm text-slate-600'>
        Already have an account?{' '}
        <Link
          to='/login'
          className='font-bold text-teal-700 transition hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
        >
          Sign in
        </Link>
      </p>
    </AuthPageShell>
  );
};

export default Register;
