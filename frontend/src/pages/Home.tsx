import { Link } from 'react-router-dom';
import { useAuth } from '../context';

const Home = () => {
  const { isUser } = useAuth();

  return (
    <div className='space-y-16 sm:space-y-20'>
      <section className='relative overflow-hidden rounded-3xl bg-teal-950 px-6 py-14 text-white shadow-sm sm:px-10 sm:py-16 lg:px-16 lg:py-20'>
        <div
          className='absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-700 opacity-40'
          aria-hidden='true'
        />
        <div
          className='absolute -bottom-32 right-32 h-72 w-72 rounded-full border-40 border-teal-800 opacity-60'
          aria-hidden='true'
        />

        <div className='relative grid items-center gap-12 lg:grid-cols-2'>
          <div className='max-w-2xl'>
            <p className='text-sm font-bold uppercase tracking-widest text-teal-300'>
              Move through the city differently
            </p>
            <h1 className='mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl'>
              Your next ride starts with VoltFlow.
            </h1>
            <p className='mt-6 max-w-xl text-base leading-7 text-teal-100 sm:text-lg'>
              Discover reliable electric scooters for daily commutes, quick errands, and every urban adventure in between.
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link
                to='/products'
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950'
              >
                Explore scooters
                <ArrowIcon />
              </Link>
              <Link
                to={isUser ? '/profile' : '/register'}
                className='inline-flex items-center justify-center rounded-xl border border-teal-700 px-6 py-3.5 text-sm font-bold text-teal-50 transition hover:bg-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300'
              >
                {isUser ? 'View your orders' : 'Create an account'}
              </Link>
            </div>
          </div>

          <div className='relative mx-auto flex aspect-square w-full max-w-md items-center justify-center rounded-full bg-teal-900/80 p-10 lg:max-w-lg'>
            <div className='absolute inset-6 rounded-full border border-teal-700' aria-hidden='true' />
            <ScooterIllustration />
          </div>
        </div>
      </section>

      <section>
        <div className='mx-auto max-w-2xl text-center'>
          <p className='text-sm font-bold uppercase tracking-widest text-teal-600'>
            Why VoltFlow
          </p>
          <h2 className='mt-3 text-3xl font-bold text-teal-950'>
            Simple shopping, better movement
          </h2>
          <p className='mt-4 leading-7 text-slate-600'>
            Everything you need to choose your scooter confidently and follow your order from purchase to delivery.
          </p>
        </div>

        <div className='mt-8 grid gap-5 md:grid-cols-3'>
          <FeatureCard
            icon={<ScooterIcon />}
            title='Quality selection'
            description='Browse well-known electric scooter models with clear product and availability information.'
          />
          <FeatureCard
            icon={<CartIcon />}
            title='Easy checkout'
            description='Add your favourites to the cart and place an order in just a few simple steps.'
          />
          <FeatureCard
            icon={<PackageIcon />}
            title='Order tracking'
            description='Open your profile at any time to review your orders and follow their current status.'
          />
        </div>
      </section>

      <section className='rounded-3xl border border-teal-100 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12'>
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='max-w-2xl'>
            <h2 className='text-2xl font-bold text-teal-950 sm:text-3xl'>
              Ready to find your electric scooter?
            </h2>
            <p className='mt-3 leading-7 text-slate-600'>
              Compare our available models and choose the ride that fits your everyday routine.
            </p>
          </div>
          <Link
            to='/products'
            className='inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2'
          >
            Browse products
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </div>
  );
};

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className='rounded-2xl border border-teal-100 bg-white p-6 shadow-sm'>
      <span className='flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700'>
        {icon}
      </span>
      <h3 className='mt-5 text-lg font-bold text-teal-950'>{title}</h3>
      <p className='mt-2 text-sm leading-6 text-slate-600'>{description}</p>
    </article>
  );
}

function ScooterIllustration() {
  return (
    <svg
      className='relative w-full text-teal-300'
      viewBox='0 0 420 320'
      fill='none'
      stroke='currentColor'
      strokeWidth='10'
      aria-hidden='true'
    >
      <circle cx='105' cy='250' r='38' />
      <circle cx='320' cy='250' r='38' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M105 250h190L255 70h55' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M250 70h75M255 70l-18-38' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M150 250 180 125h82' />
      <path strokeLinecap='round' d='M160 250h145' />
      <circle cx='212' cy='91' r='9' fill='currentColor' stroke='none' />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className='h-4 w-4' viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M4 10h12m-5-5 5 5-5 5' />
    </svg>
  );
}

function ScooterIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='6' cy='18' r='2' />
      <circle cx='18' cy='18' r='2' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18h10L13 5h4M13 5h5M9 18l2-8h3' />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20.5 8H7' />
      <circle cx='9' cy='20' r='1' />
      <circle cx='18' cy='20' r='1' />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M12 11v10' />
    </svg>
  );
}

export default Home;
