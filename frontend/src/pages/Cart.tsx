import { Link } from 'react-router-dom';
import { ProductImage } from '../components/products';
import { formatPrice } from '../lib/formatters';
import { useCartStore } from '../stores';
import type { CartItem } from '../stores';

const Cart = () => {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const total =
    items.reduce(
      (sum, item) =>
        sum + Math.round(Number(item.product.price) * 100) * item.quantity,
      0,
    ) / 100;

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div>
      <div className='max-w-3xl'>
        <p className='text-sm font-bold uppercase tracking-widest text-teal-600'>
          Your selection
        </p>
        <h1 className='mt-3 text-3xl font-bold text-teal-950 sm:text-4xl'>
          Shopping cart
        </h1>
        <p className='mt-3 text-slate-600'>
          {totalItems} {totalItems === 1 ? 'item' : 'items'} ready for checkout.
        </p>
      </div>

      <div className='mt-8 grid items-start gap-8 lg:grid-cols-3'>
        <section className='lg:col-span-2' aria-labelledby='cart-items-heading'>
          <div className='flex items-center justify-between'>
            <h2 id='cart-items-heading' className='text-xl font-bold text-teal-950'>
              Cart items
            </h2>
            <Link
              to='/products'
              className='text-sm font-bold text-teal-700 transition hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
            >
              Continue shopping
            </Link>
          </div>

          <ul className='mt-4 space-y-4'>
            {items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </ul>
        </section>

        <aside className='rounded-2xl border border-teal-100 bg-white p-6 shadow-sm lg:sticky lg:top-24'>
          <h2 className='text-xl font-bold text-teal-950'>Order summary</h2>

          <dl className='mt-6 space-y-4 text-sm'>
            <div className='flex items-center justify-between gap-4'>
              <dt className='text-slate-600'>Products ({totalItems})</dt>
              <dd className='font-semibold text-teal-950'>{formatPrice(total)}</dd>
            </div>
            <div className='flex items-center justify-between gap-4'>
              <dt className='text-slate-600'>Shipping</dt>
              <dd className='text-right font-medium text-slate-600'>
                Calculated at checkout
              </dd>
            </div>
          </dl>

          <div className='mt-6 flex items-center justify-between border-t border-teal-100 pt-5'>
            <span className='font-bold text-teal-950'>Total</span>
            <span className='text-2xl font-bold text-teal-700'>
              {formatPrice(total)}
            </span>
          </div>

          <Link
            to='/checkout'
            className='mt-6 block w-full rounded-xl bg-teal-600 px-5 py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2'
          >
            Continue to checkout
          </Link>

          <p className='mt-4 text-center text-xs leading-5 text-slate-500'>
            Product availability and final prices are confirmed when your order is placed.
          </p>
        </aside>
      </div>
    </div>
  );
};

function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}) {
  const { product, quantity } = item;
  const lineTotal =
    (Math.round(Number(product.price) * 100) * quantity) / 100;

  return (
    <li className='rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-5'>
      <div className='flex gap-4 sm:gap-5'>
        <Link
          to={`/product/${product.id}`}
          className='group h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 sm:h-32 sm:w-32'
          aria-label={`View ${product.name}`}
        >
          <ProductImage
            product={product}
            className='h-full w-full'
            imageClassName='p-2 sm:p-3'
          />
        </Link>

        <div className='min-w-0 flex-1'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <h2 className='font-bold leading-6 text-teal-950 sm:text-lg'>
                <Link
                  to={`/product/${product.id}`}
                  className='transition hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
                >
                  {product.name}
                </Link>
              </h2>
              <p className='mt-1 text-sm text-slate-600'>
                {formatPrice(product.price)} each
              </p>
              <p className='mt-1 text-xs font-medium text-teal-700'>
                {product.stock_quantity} currently available
              </p>
            </div>

            <button
              type='button'
              onClick={() => onRemove(product.id)}
              className='shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500'
              aria-label={`Remove ${product.name} from cart`}
            >
              <TrashIcon />
            </button>
          </div>

          <div className='mt-5 flex flex-col gap-4 border-t border-teal-50 pt-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <label
                className='mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500'
                htmlFor={`cart-quantity-${product.id}`}
              >
                Quantity
              </label>
              <div className='flex h-10 w-fit items-center overflow-hidden rounded-lg border border-teal-200'>
                <button
                  type='button'
                  onClick={() => onQuantityChange(product.id, quantity - 1)}
                  disabled={quantity <= 1}
                  className='h-full w-9 font-bold text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40'
                  aria-label={`Decrease quantity of ${product.name}`}
                >
                  &minus;
                </button>
                <input
                  id={`cart-quantity-${product.id}`}
                  type='number'
                  min='1'
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(event) =>
                    onQuantityChange(product.id, Number(event.target.value) || 1)
                  }
                  className='h-full w-12 border-x border-teal-100 text-center text-sm font-bold text-teal-950 outline-none'
                />
                <button
                  type='button'
                  onClick={() => onQuantityChange(product.id, quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                  className='h-full w-9 font-bold text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40'
                  aria-label={`Increase quantity of ${product.name}`}
                >
                  +
                </button>
              </div>
            </div>

            <div className='sm:text-right'>
              <p className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
                Subtotal
              </p>
              <p className='mt-1 text-lg font-bold text-teal-700'>
                {formatPrice(lineTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function EmptyCart() {
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
      <h1 className='mt-6 text-3xl font-bold text-teal-950'>Your cart is empty</h1>
      <p className='mx-auto mt-3 max-w-md leading-7 text-slate-600'>
        Explore our electric scooters and add the products that fit your journey.
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

function TrashIcon() {
  return (
    <svg
      className='h-5 w-5'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      aria-hidden='true'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5' />
    </svg>
  );
}

export default Cart;
