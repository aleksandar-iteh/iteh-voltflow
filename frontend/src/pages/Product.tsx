import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductImage } from '../components/products';
import { useAuth } from '../context';
import { formatPrice } from '../lib/formatters';
import { useCartStore, useProductStore } from '../stores';

interface QuantityState {
  productId: number | null;
  value: number;
}

interface CartFeedback {
  productId: number;
  message: string;
}

const Product = () => {
  const { id } = useParams();
  const productId = Number(id);
  const validProductId =
    Number.isInteger(productId) && productId > 0 ? productId : null;
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const error = useProductStore((state) => state.error);
  const fetchProduct = useProductStore((state) => state.fetchProduct);
  const addItem = useCartStore((state) => state.addItem);
  const cartQuantity = useCartStore(
    (state) =>
      state.items.find((item) => item.product.id === validProductId)?.quantity ?? 0,
  );
  const { isUser } = useAuth();
  const requestedProductId = useRef<number | null>(null);
  const [quantityState, setQuantityState] = useState<QuantityState>({
    productId: validProductId,
    value: 1,
  });
  const [feedback, setFeedback] = useState<CartFeedback | null>(null);
  const product =
    selectedProduct?.id === validProductId ? selectedProduct : null;
  const quantity =
    quantityState.productId === validProductId ? quantityState.value : 1;

  useEffect(() => {
    if (
      validProductId === null ||
      requestedProductId.current === validProductId ||
      product
    ) {
      return;
    }

    requestedProductId.current = validProductId;
    void fetchProduct(validProductId).catch(() => undefined);
  }, [fetchProduct, product, validProductId]);

  const updateQuantity = (nextQuantity: number) => {
    if (!product) {
      return;
    }

    setQuantityState({
      productId: product.id,
      value: Math.min(Math.max(1, nextQuantity), product.stock_quantity),
    });
    setFeedback(null);
  };

  const handleAddToCart = () => {
    if (!product || product.stock_quantity < 1) {
      return;
    }

    addItem(product, quantity);
    setFeedback({
      productId: product.id,
      message: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart.`,
    });
  };

  if (validProductId === null) {
    return <ProductNotFound message='The requested product address is not valid.' />;
  }

  if (error && !product) {
    return (
      <ProductNotFound
        message={error}
        onRetry={() => {
          requestedProductId.current = validProductId;
          void fetchProduct(validProductId).catch(() => undefined);
        }}
      />
    );
  }

  if (!product) {
    return <div className='min-h-96' aria-busy='true' />;
  }

  return (
    <div>
      <nav className='mb-7 flex items-center gap-2 text-sm text-slate-600' aria-label='Breadcrumb'>
        <Link className='font-medium transition hover:text-teal-700' to='/products'>
          Products
        </Link>
        <span aria-hidden='true'>/</span>
        <span className='truncate text-teal-950' aria-current='page'>
          {product.name}
        </span>
      </nav>

      <div className='grid gap-8 lg:grid-cols-2 lg:gap-12'>
        <ProductImage
          product={product}
          className='aspect-square rounded-3xl border border-teal-100 shadow-sm'
        />

        <div className='flex flex-col justify-center'>
          <span
            className={`w-fit rounded-full px-3 py-1.5 text-sm font-bold ${
              product.stock_quantity > 0
                ? 'bg-teal-100 text-teal-800'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {product.stock_quantity > 0
              ? `${product.stock_quantity} available`
              : 'Out of stock'}
          </span>

          <h1 className='mt-5 text-3xl font-bold leading-tight text-teal-950 sm:text-4xl'>
            {product.name}
          </h1>
          <p className='mt-5 text-3xl font-bold text-teal-700'>
            {formatPrice(product.price)}
          </p>
          <p className='mt-6 leading-7 text-slate-600'>
            {product.description ?? 'No product description is available.'}
          </p>

          {isUser && (
            <div className='mt-8 border-t border-teal-100 pt-7'>
              {product.stock_quantity > 0 ? (
                <>
                  <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
                    <div>
                      <label className='mb-2 block text-sm font-semibold text-teal-950' htmlFor='product-quantity'>
                        Quantity
                      </label>
                      <div className='flex h-12 items-center overflow-hidden rounded-xl border border-teal-200 bg-white'>
                        <button
                          type='button'
                          onClick={() => updateQuantity(quantity - 1)}
                          disabled={quantity <= 1}
                          className='h-full w-11 text-lg font-bold text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40'
                          aria-label='Decrease quantity'
                        >
                          &minus;
                        </button>
                        <input
                          id='product-quantity'
                          type='number'
                          min='1'
                          max={product.stock_quantity}
                          value={quantity}
                          onChange={(event) => updateQuantity(Number(event.target.value) || 1)}
                          className='h-full w-16 border-x border-teal-100 text-center text-sm font-bold text-teal-950 outline-none'
                        />
                        <button
                          type='button'
                          onClick={() => updateQuantity(quantity + 1)}
                          disabled={quantity >= product.stock_quantity}
                          className='h-full w-11 text-lg font-bold text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40'
                          aria-label='Increase quantity'
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={handleAddToCart}
                      className='h-12 flex-1 rounded-xl bg-teal-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2'
                    >
                      Add to cart
                    </button>
                  </div>

                  {cartQuantity > 0 && (
                    <p className='mt-3 text-sm text-slate-600'>
                      You currently have {cartQuantity}{' '}
                      {cartQuantity === 1 ? 'item' : 'items'} of this product in your cart.
                    </p>
                  )}

                  {feedback?.productId === product.id && (
                    <div
                      className='mt-4 flex flex-col gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800 sm:flex-row sm:items-center sm:justify-between'
                      role='status'
                    >
                      <span className='font-semibold'>{feedback.message}</span>
                      <Link className='font-bold underline underline-offset-2' to='/cart'>
                        View cart
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <p className='rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700'>
                  This product is currently unavailable.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function ProductNotFound({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className='rounded-2xl border border-teal-100 bg-white px-6 py-16 text-center shadow-sm'>
      <h1 className='text-2xl font-bold text-teal-950'>Product not available</h1>
      <p className='mx-auto mt-3 max-w-xl text-slate-600'>{message}</p>
      <div className='mt-6 flex justify-center gap-3'>
        {onRetry && (
          <button
            type='button'
            onClick={onRetry}
            className='rounded-xl border border-teal-200 px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50'
          >
            Try again
          </button>
        )}
        <Link
          to='/products'
          className='rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700'
        >
          Back to products
        </Link>
      </div>
    </div>
  );
}

export default Product;
