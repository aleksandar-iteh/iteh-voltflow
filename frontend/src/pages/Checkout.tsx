import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductImage } from '../components/products';
import { formatPrice } from '../lib/formatters';
import { useCartStore, useOrderStore } from '../stores';
import type { ValidationErrors } from '../types/api';

const Checkout = () => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const createOrder = useOrderStore((state) => state.createOrder);
  const isLoading = useOrderStore((state) => state.isLoading);
  const error = useOrderStore((state) => state.error);
  const validationErrors = useOrderStore((state) => state.validationErrors);
  const clearError = useOrderStore((state) => state.clearError);
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const total =
    items.reduce(
      (sum, item) =>
        sum + Math.round(Number(item.product.price) * 100) * item.quantity,
      0,
    ) / 100;
  const itemErrors = checkoutItemErrors(validationErrors, items);

  useEffect(() => {
    clearError();

    return clearError;
  }, [clearError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    try {
      const order = await createOrder({
        shipping_address: shippingAddress.trim(),
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      navigate(`/order/${order.id}`, { replace: true });
    } catch {
      return;
    }
  };

  if (items.length === 0) {
    return <EmptyCheckout />;
  }

  return (
    <div>
      <nav className='mb-7 flex items-center gap-2 text-sm text-slate-600' aria-label='Breadcrumb'>
        <Link className='font-medium transition hover:text-teal-700' to='/cart'>
          Cart
        </Link>
        <span aria-hidden='true'>/</span>
        <span className='text-teal-950' aria-current='page'>
          Checkout
        </span>
      </nav>

      <div className='max-w-3xl'>
        <p className='text-sm font-bold uppercase tracking-widest text-teal-600'>
          Almost there
        </p>
        <h1 className='mt-3 text-3xl font-bold text-teal-950 sm:text-4xl'>
          Complete your order
        </h1>
        <p className='mt-4 leading-7 text-slate-600'>
          Confirm where your order should be delivered and review the selected products before placing it.
        </p>
      </div>

      <form
        className='mt-8 grid items-start gap-8 lg:grid-cols-3'
        onSubmit={handleSubmit}
      >
        <div className='space-y-6 lg:col-span-2'>
          {error && (
            <div
              className='rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700'
              role='alert'
            >
              <p className='font-bold'>We could not place your order.</p>
              <p className='mt-1 text-sm'>{error}</p>

              {itemErrors.length > 0 && (
                <ul className='mt-3 list-disc space-y-1 pl-5 text-sm'>
                  {itemErrors.map((itemError) => (
                    <li key={itemError}>{itemError}</li>
                  ))}
                </ul>
              )}

              <Link
                to='/cart'
                className='mt-4 inline-flex text-sm font-bold underline underline-offset-2'
              >
                Review your cart
              </Link>
            </div>
          )}

          <section className='rounded-2xl border border-teal-100 bg-white p-6 shadow-sm sm:p-8'>
            <div className='flex items-start gap-4'>
              <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700'>
                <LocationIcon />
              </span>
              <div>
                <h2 className='text-xl font-bold text-teal-950'>Shipping information</h2>
                <p className='mt-1 text-sm leading-6 text-slate-600'>
                  Enter the complete address where you want to receive your order.
                </p>
              </div>
            </div>

            <div className='mt-6'>
              <div className='flex items-center justify-between gap-4'>
                <label
                  className='block text-sm font-semibold text-teal-950'
                  htmlFor='shipping-address'
                >
                  Shipping address
                </label>
                <span className='text-xs text-slate-500'>
                  {shippingAddress.length}/255
                </span>
              </div>
              <textarea
                id='shipping-address'
                name='shipping_address'
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
                autoComplete='street-address'
                maxLength={255}
                rows={5}
                required
                placeholder='Street and number, city, postal code, country'
                aria-invalid={Boolean(validationErrors.shipping_address?.[0])}
                aria-describedby={
                  validationErrors.shipping_address?.[0]
                    ? 'shipping-address-error'
                    : 'shipping-address-help'
                }
                className={`mt-2 block w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-teal-950 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                  validationErrors.shipping_address?.[0]
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-teal-100 focus:border-teal-600 focus:ring-teal-100'
                }`}
              />
              {validationErrors.shipping_address?.[0] ? (
                <p id='shipping-address-error' className='mt-2 text-sm text-red-600'>
                  {validationErrors.shipping_address[0]}
                </p>
              ) : (
                <p id='shipping-address-help' className='mt-2 text-xs leading-5 text-slate-500'>
                  Include all details needed for a successful delivery.
                </p>
              )}
            </div>
          </section>

          <section className='rounded-2xl border border-teal-100 bg-teal-950 p-6 text-white shadow-sm sm:p-8'>
            <div className='flex items-start gap-4'>
              <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-teal-200'>
                <ShieldIcon />
              </span>
              <div>
                <h2 className='text-lg font-bold'>Server-verified order</h2>
                <p className='mt-2 text-sm leading-6 text-teal-100'>
                  Product availability and prices are checked again by VoltFlow when the order is placed. Your order starts with pending status.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className='rounded-2xl border border-teal-100 bg-white p-6 shadow-sm lg:sticky lg:top-24'>
          <div className='flex items-center justify-between gap-4'>
            <h2 className='text-xl font-bold text-teal-950'>Order summary</h2>
            <Link className='text-sm font-bold text-teal-700 hover:text-teal-900' to='/cart'>
              Edit
            </Link>
          </div>

          <ul className='mt-5 space-y-4 border-b border-teal-100 pb-5'>
            {items.map((item) => (
              <li key={item.product.id} className='flex gap-3'>
                <ProductImage
                  product={item.product}
                  className='h-16 w-16 shrink-0 rounded-lg border border-teal-50'
                  imageClassName='p-1.5'
                />
                <div className='min-w-0 flex-1'>
                  <p className='line-clamp-2 text-sm font-semibold leading-5 text-teal-950'>
                    {item.product.name}
                  </p>
                  <p className='mt-1 text-xs text-slate-500'>Quantity: {item.quantity}</p>
                </div>
                <p className='shrink-0 text-sm font-bold text-teal-700'>
                  {formatPrice(lineTotal(item.product.price, item.quantity))}
                </p>
              </li>
            ))}
          </ul>

          <dl className='mt-5 space-y-3 text-sm'>
            <div className='flex justify-between gap-4'>
              <dt className='text-slate-600'>Products ({totalItems})</dt>
              <dd className='font-semibold text-teal-950'>{formatPrice(total)}</dd>
            </div>
            <div className='flex justify-between gap-4'>
              <dt className='text-slate-600'>Shipping</dt>
              <dd className='font-semibold text-teal-700'>Included</dd>
            </div>
          </dl>

          <div className='mt-5 flex items-center justify-between border-t border-teal-100 pt-5'>
            <span className='font-bold text-teal-950'>Total</span>
            <span className='text-2xl font-bold text-teal-700'>
              {formatPrice(total)}
            </span>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='mt-6 w-full rounded-xl bg-teal-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isLoading ? 'Placing order...' : 'Place order'}
          </button>

          <p className='mt-4 text-center text-xs leading-5 text-slate-500'>
            By placing the order, you confirm the selected products, quantities, and delivery address.
          </p>
        </aside>
      </form>
    </div>
  );
};

function checkoutItemErrors(
  validationErrors: ValidationErrors,
  items: ReturnType<typeof useCartStore.getState>['items'],
): string[] {
  return Object.entries(validationErrors).flatMap(([field, messages]) => {
    if (!field.startsWith('items')) {
      return [];
    }

    const itemIndex = Number(field.split('.')[1]);
    const productName = Number.isInteger(itemIndex)
      ? items[itemIndex]?.product.name
      : undefined;

    return messages.map((message) =>
      productName ? `${productName}: ${message}` : message,
    );
  });
}

function lineTotal(price: string, quantity: number): number {
  return (Math.round(Number(price) * 100) * quantity) / 100;
}

function EmptyCheckout() {
  return (
    <div className='mx-auto max-w-2xl rounded-3xl border border-teal-100 bg-white px-6 py-16 text-center shadow-sm sm:px-10'>
      <span className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-600'>
        <svg
          className='h-10 w-10'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.7'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20.5 8H7M10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z'
          />
        </svg>
      </span>
      <h1 className='mt-6 text-3xl font-bold text-teal-950'>Nothing to checkout yet</h1>
      <p className='mx-auto mt-3 max-w-md leading-7 text-slate-600'>
        Add at least one electric scooter to your cart before continuing to checkout.
      </p>
      <Link
        to='/products'
        className='mt-7 inline-flex rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2'
      >
        Browse products
      </Link>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg
      className='h-6 w-6'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      aria-hidden='true'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 21s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12Z' />
      <circle cx='12' cy='9' r='2.5' />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className='h-6 w-6'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      aria-hidden='true'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 3 5 6v5c0 4.8 2.9 8.1 7 10 4.1-1.9 7-5.2 7-10V6l-7-3Z' />
      <path strokeLinecap='round' strokeLinejoin='round' d='m9 12 2 2 4-4' />
    </svg>
  );
}

export default Checkout;
