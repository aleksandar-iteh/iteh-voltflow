import type { ReactNode } from 'react';

interface AuthPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

const benefits = [
  'Carefully selected electric scooters',
  'Secure and straightforward checkout',
  'Simple order status tracking',
];

export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <section className='flex justify-center'>
      <div className='grid w-full max-w-5xl overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-xl lg:grid-cols-2'>
        <aside className='relative hidden overflow-hidden bg-teal-700 p-12 text-white lg:block'>
          <span className='absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/30' />
          <span className='absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-teal-900/30' />

          <div className='relative'>
            <div className='flex items-center gap-3'>
              <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-teal-700 shadow-sm'>
                V
              </span>
              <span className='text-xl font-bold'>VoltFlow</span>
            </div>

            <p className='mt-10 text-sm font-semibold uppercase tracking-widest text-teal-200'>
              Electric mobility made simple
            </p>
            <h2 className='mt-3 max-w-md text-3xl font-bold leading-tight sm:text-4xl'>
              Move through your city with confidence.
            </h2>
            <p className='mt-5 max-w-md leading-7 text-teal-100'>
              Create your account, discover the right scooter, and keep every part of your purchase in one place.
            </p>

            <ul className='mt-8 space-y-4'>
              {benefits.map((benefit) => (
                <li key={benefit} className='flex items-center gap-3 text-sm font-medium text-teal-50'>
                  <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500'>
                    <svg
                      className='h-4 w-4'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className='p-6 sm:p-10 lg:p-12'>
          <p className='text-sm font-bold uppercase tracking-widest text-teal-600'>
            {eyebrow}
          </p>
          <h1 className='mt-3 text-3xl font-bold text-teal-950'>{title}</h1>
          <p className='mt-3 leading-7 text-slate-600'>{description}</p>
          <div className='mt-8'>{children}</div>
        </div>
      </div>
    </section>
  );
}
