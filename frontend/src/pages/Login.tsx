import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthPageShell, PasswordField, TextField } from '../components/auth';
import { useAuth } from '../context';

interface PreviousLocation {
  pathname: string;
  search?: string;
  hash?: string;
}

interface LoginLocationState {
  from?: PreviousLocation;
}

const Login = () => {
  const {
    login,
    clearError,
    error,
    validationErrors,
    isLoading,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    clearError();

    return clearError;
  }, [clearError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const user = await login({ email: email.trim(), password });
      const state = location.state as LoginLocationState | null;
      const previousLocation = state?.from;
      const previousPath = previousLocation
        ? `${previousLocation.pathname}${previousLocation.search ?? ''}${previousLocation.hash ?? ''}`
        : '/';

      navigate(user.role === 'admin' ? '/admin' : previousPath, { replace: true });
    } catch {
      return;
    }
  };

  return (
    <AuthPageShell
      eyebrow='Welcome back'
      title='Sign in to your account'
      description='Continue shopping, manage your cart, and follow your orders from one place.'
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
          autoComplete='current-password'
          error={validationErrors.password?.[0]}
        />

        <button
          type='submit'
          disabled={isLoading}
          className='w-full rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className='mt-7 text-center text-sm text-slate-600'>
        New to VoltFlow?{' '}
        <Link
          to='/register'
          className='font-bold text-teal-700 transition hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
        >
          Create an account
        </Link>
      </p>
    </AuthPageShell>
  );
};

export default Login;
