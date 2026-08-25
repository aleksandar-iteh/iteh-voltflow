import { ProductImage } from '../products';
import { useProductStore } from '../../stores';
import type { Product } from '../../types/models';
import { AdminModal } from './AdminModal';

interface DeleteProductModalProps {
  product: Product;
  onClose: () => void;
  onDeleted: (product: Product) => void;
}

export function DeleteProductModal({
  product,
  onClose,
  onDeleted,
}: DeleteProductModalProps) {
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const titleId = `delete-product-title-${product.id}`;

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      onDeleted(product);
    } catch {
      return;
    }
  };

  return (
    <AdminModal
      labelledBy={titleId}
      onClose={onClose}
      canClose={!isLoading}
      panelClassName='max-w-lg overflow-hidden'
    >
      <div className='p-5 sm:p-7'>
        <div className='flex items-start gap-4'>
          <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700'>
            <WarningIcon />
          </span>
          <div>
            <h2 id={titleId} className='text-xl font-bold text-teal-950'>
              Delete product?
            </h2>
            <p className='mt-2 text-sm leading-6 text-slate-600'>
              This permanently removes the product and its locally stored image.
            </p>
          </div>
        </div>

        <div className='mt-6 flex items-center gap-4 rounded-xl border border-teal-100 bg-teal-50 p-4'>
          <ProductImage
            product={product}
            className='h-16 w-20 shrink-0 rounded-lg border border-teal-100'
            imageClassName='p-1.5'
          />
          <div className='min-w-0'>
            <p className='line-clamp-2 font-bold text-teal-950'>{product.name}</p>
            <p className='mt-1 text-xs text-slate-500'>Product #{product.id}</p>
          </div>
        </div>

        {error && (
          <div
            className='mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'
            role='alert'
          >
            <p className='font-bold'>The product could not be deleted.</p>
            <p className='mt-1'>{error}</p>
          </div>
        )}

        <p className='mt-5 text-xs leading-5 text-slate-500'>
          Products referenced by existing orders are protected and cannot be deleted.
        </p>
      </div>

      <div className='flex flex-col-reverse gap-3 border-t border-teal-100 bg-teal-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7'>
        <button
          type='button'
          onClick={onClose}
          disabled={isLoading}
          className='rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:opacity-50'
        >
          Keep product
        </button>
        <button
          type='button'
          onClick={() => void handleDelete()}
          disabled={isLoading}
          className='rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isLoading ? 'Deleting product...' : 'Delete product'}
        </button>
      </div>
    </AdminModal>
  );
}

function WarningIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 3 2.8 20h18.4L12 3Z' />
      <path strokeLinecap='round' d='M12 9v5m0 3h.01' />
    </svg>
  );
}
