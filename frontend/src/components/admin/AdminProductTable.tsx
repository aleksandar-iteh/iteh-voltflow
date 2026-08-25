import { ProductImage } from '../products';
import { formatPrice } from '../../lib/formatters';
import type { Product } from '../../types/models';

interface AdminProductTableProps {
  products: Product[];
  disabled: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function AdminProductTable({
  products,
  disabled,
  onEdit,
  onDelete,
}: AdminProductTableProps) {
  return (
    <div className='max-h-144 overflow-auto rounded-2xl border border-teal-100'>
      <table className='w-full min-w-5xl border-collapse text-left'>
        <thead className='sticky top-0 z-10 bg-teal-50 text-xs font-bold uppercase tracking-wider text-teal-800 shadow-sm'>
          <tr>
            <th scope='col' className='px-5 py-4'>Image</th>
            <th scope='col' className='px-5 py-4'>Product</th>
            <th scope='col' className='px-5 py-4'>Price</th>
            <th scope='col' className='px-5 py-4'>Stock</th>
            <th scope='col' className='px-5 py-4'>Last updated</th>
            <th scope='col' className='px-5 py-4 text-right'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-teal-100 bg-white'>
          {products.map((product) => (
            <tr key={product.id} className='transition hover:bg-teal-50/60'>
              <td className='px-5 py-4'>
                <ProductImage
                  product={product}
                  className='h-16 w-20 rounded-xl border border-teal-100'
                  imageClassName='p-1.5'
                />
              </td>
              <th scope='row' className='max-w-sm px-5 py-4 font-normal'>
                <p className='line-clamp-1 font-bold text-teal-950'>{product.name}</p>
                <p className='mt-1 line-clamp-2 text-xs leading-5 text-slate-500'>
                  {product.description ?? 'No description'}
                </p>
              </th>
              <td className='whitespace-nowrap px-5 py-4 font-bold text-teal-700'>
                {formatPrice(product.price)}
              </td>
              <td className='whitespace-nowrap px-5 py-4'>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    product.stock_quantity > 0
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {product.stock_quantity} in stock
                </span>
              </td>
              <td className='whitespace-nowrap px-5 py-4 text-sm text-slate-600'>
                {formatDate(product.updated_at)}
              </td>
              <td className='whitespace-nowrap px-5 py-4 text-right'>
                <div className='inline-flex gap-2'>
                  <button
                    type='button'
                    onClick={() => onEdit(product)}
                    disabled={disabled}
                    className='rounded-lg border border-teal-200 px-3 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => onDelete(product)}
                    disabled={disabled}
                    className='rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value: string | null): string {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date);
}
