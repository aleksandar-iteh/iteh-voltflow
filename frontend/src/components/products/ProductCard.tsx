import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/formatters';
import type { Product } from '../../types/models';
import { ProductImage } from './ProductImage';

export function ProductCard({ product }: { product: Product }) {
  const isInStock = product.stock_quantity > 0;

  return (
    <article className='group flex h-full flex-col overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg'>
      <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        <ProductImage product={product} className='aspect-square border-b border-teal-50' />
      </Link>

      <div className='flex flex-1 flex-col p-5'>
        <div className='flex items-start justify-between gap-3'>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
              isInStock
                ? 'bg-teal-50 text-teal-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isInStock ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        <h2 className='mt-4 text-lg font-bold leading-6 text-teal-950'>
          <Link
            to={`/product/${product.id}`}
            className='transition hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
          >
            {product.name}
          </Link>
        </h2>

        <p className='mt-3 line-clamp-3 text-sm leading-6 text-slate-600'>
          {product.description ?? 'No product description is available.'}
        </p>

        <div className='mt-auto flex items-end justify-between gap-4 pt-6'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
              Price
            </p>
            <p className='mt-1 text-xl font-bold text-teal-700'>
              {formatPrice(product.price)}
            </p>
          </div>
          <Link
            to={`/product/${product.id}`}
            className='rounded-xl border border-teal-200 px-4 py-2.5 text-sm font-bold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
