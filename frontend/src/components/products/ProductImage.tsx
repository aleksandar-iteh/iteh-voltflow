import { useState } from 'react';
import type { Product } from '../../types/models';

interface ProductImageProps {
  product: Pick<Product, 'name' | 'image_url'>;
  className?: string;
}

export function ProductImage({ product, className = '' }: ProductImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const canShowImage = product.image_url && failedUrl !== product.image_url;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-white ${className}`}
    >
      {canShowImage ? (
        <img
          src={product.image_url ?? undefined}
          alt={product.name}
          onError={() => setFailedUrl(product.image_url)}
          className='h-full w-full object-contain p-6 transition duration-300 group-hover:scale-105'
        />
      ) : (
        <div className='flex flex-col items-center gap-3 text-teal-300'>
          <svg
            className='h-20 w-20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M5 17h11.5M8 17l2-8h5l2 8M15 9l1-4h2M5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm13 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z'
            />
          </svg>
          <span className='text-sm font-semibold'>Image unavailable</span>
        </div>
      )}
    </div>
  );
}
