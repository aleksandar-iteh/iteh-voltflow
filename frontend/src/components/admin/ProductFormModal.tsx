import { useEffect, useRef, useState } from 'react';
import type {
  ChangeEvent,
  DragEvent,
  FormEvent,
  ReactNode,
} from 'react';
import { useProductStore } from '../../stores';
import type { Product } from '../../types/models';
import { ProductImage } from '../products';
import { AdminModal } from './AdminModal';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSaved: (product: Product, mode: 'create' | 'edit') => void;
}

export function ProductFormModal({
  product,
  onClose,
  onSaved,
}: ProductFormModalProps) {
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const validationErrors = useProductStore((state) => state.validationErrors);
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price ?? '');
  const [stockQuantity, setStockQuantity] = useState(
    product ? String(product.stock_quantity) : '',
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    product?.image_url ?? null,
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const ownedPreviewUrlRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isEditing = product !== null;
  const titleId = `product-form-title-${product?.id ?? 'new'}`;

  useEffect(
    () => () => {
      if (ownedPreviewUrlRef.current) {
        URL.revokeObjectURL(ownedPreviewUrlRef.current);
      }
    },
    [],
  );

  const handleImageInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      selectImage(file);
    }
  };

  const handleImageDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];

    if (file) {
      selectImage(file);
    }
  };

  const selectImage = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Choose a JPG, PNG, or WebP image.');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError('The image must not be larger than 5 MB.');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      return;
    }

    if (ownedPreviewUrlRef.current) {
      URL.revokeObjectURL(ownedPreviewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    ownedPreviewUrlRef.current = previewUrl;
    setImageFile(file);
    setImagePreviewUrl(previewUrl);
    setImageError(null);
  };

  const removeSelectedImage = () => {
    if (ownedPreviewUrlRef.current) {
      URL.revokeObjectURL(ownedPreviewUrlRef.current);
      ownedPreviewUrlRef.current = null;
    }

    setImageFile(null);
    setImagePreviewUrl(product?.image_url ?? null);
    setImageError(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: price.trim(),
      stock_quantity: Number(stockQuantity),
      image: imageFile,
    };

    try {
      const savedProduct = product
        ? await updateProduct(product.id, payload)
        : await createProduct(payload);

      onSaved(savedProduct, product ? 'edit' : 'create');
    } catch {
      return;
    }
  };

  const currentImage = {
    name: name.trim() || product?.name || 'Product image preview',
    image_url: imagePreviewUrl,
  };
  const serverImageError = validationErrors.image?.[0];

  return (
    <AdminModal
      labelledBy={titleId}
      onClose={onClose}
      canClose={!isLoading}
      panelClassName='max-w-3xl overflow-hidden'
    >
      <form
        onSubmit={handleSubmit}
        className='flex max-h-[calc(100dvh-2rem)] flex-col'
      >
        <div className='flex items-start justify-between gap-4 border-b border-teal-100 px-5 py-4 sm:px-7 sm:py-5'>
          <div>
            <p className='text-xs font-bold uppercase tracking-widest text-teal-600'>
              {isEditing ? 'Edit catalogue item' : 'New catalogue item'}
            </p>
            <h2 id={titleId} className='mt-1 text-2xl font-bold text-teal-950'>
              {isEditing ? 'Edit product' : 'Create product'}
            </h2>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={isLoading}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:opacity-50'
            aria-label='Close product form'
          >
            <CloseIcon />
          </button>
        </div>

        <div className='overflow-y-auto px-5 py-6 sm:px-7'>
          {error && (
            <div
              className='mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'
              role='alert'
            >
              <p className='font-bold'>The product could not be saved.</p>
              <p className='mt-1'>{error}</p>
            </div>
          )}

          <div className='grid gap-6 lg:grid-cols-5'>
            <div className='space-y-5 lg:col-span-3'>
              <FormField
                id='admin-product-name'
                label='Product name'
                error={validationErrors.name?.[0]}
              >
                <input
                  id='admin-product-name'
                  name='name'
                  type='text'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={255}
                  required
                  autoFocus
                  aria-invalid={Boolean(validationErrors.name?.[0])}
                  className={inputClass(Boolean(validationErrors.name?.[0]))}
                  placeholder='e.g. Segway Ninebot MAX G2 E'
                />
              </FormField>

              <FormField
                id='admin-product-description'
                label='Description'
                error={validationErrors.description?.[0]}
                optional
              >
                <textarea
                  id='admin-product-description'
                  name='description'
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={6}
                  aria-invalid={Boolean(validationErrors.description?.[0])}
                  className={`${inputClass(Boolean(validationErrors.description?.[0]))} resize-y leading-6`}
                  placeholder='Describe the scooter, its range, performance, and key features.'
                />
              </FormField>

              <div className='grid gap-5 sm:grid-cols-2'>
                <FormField
                  id='admin-product-price'
                  label='Price (EUR)'
                  error={validationErrors.price?.[0]}
                >
                  <input
                    id='admin-product-price'
                    name='price'
                    type='number'
                    min='0'
                    step='0.01'
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    required
                    aria-invalid={Boolean(validationErrors.price?.[0])}
                    className={inputClass(Boolean(validationErrors.price?.[0]))}
                    placeholder='0.00'
                  />
                </FormField>

                <FormField
                  id='admin-product-stock'
                  label='Stock quantity'
                  error={validationErrors.stock_quantity?.[0]}
                >
                  <input
                    id='admin-product-stock'
                    name='stock_quantity'
                    type='number'
                    min='0'
                    step='1'
                    value={stockQuantity}
                    onChange={(event) => setStockQuantity(event.target.value)}
                    required
                    aria-invalid={Boolean(validationErrors.stock_quantity?.[0])}
                    className={inputClass(
                      Boolean(validationErrors.stock_quantity?.[0]),
                    )}
                    placeholder='0'
                  />
                </FormField>
              </div>
            </div>

            <div className='lg:col-span-2'>
              <div className='flex items-center justify-between gap-3'>
                <label
                  className='text-sm font-semibold text-teal-950'
                  htmlFor='admin-product-image'
                >
                  Product image
                </label>
                <span className='text-xs text-slate-500'>Optional</span>
              </div>

              <ProductImage
                product={currentImage}
                className='mt-2 aspect-square w-full rounded-2xl border border-teal-100'
                imageClassName='p-3'
              />

              <label
                htmlFor='admin-product-image'
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleImageDrop}
                className='mt-4 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-teal-300 bg-teal-50 px-4 py-5 text-center transition hover:border-teal-500 hover:bg-teal-100 focus-within:ring-2 focus-within:ring-teal-600'
              >
                <UploadIcon />
                <span className='mt-2 text-sm font-bold text-teal-800'>
                  Choose or drop an image
                </span>
                <span className='mt-1 text-xs leading-5 text-slate-500'>
                  JPG, PNG, or WebP · maximum 5 MB
                </span>
                <input
                  ref={imageInputRef}
                  id='admin-product-image'
                  name='image'
                  type='file'
                  accept='.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp'
                  onChange={handleImageInput}
                  className='sr-only'
                  aria-invalid={Boolean(serverImageError || imageError)}
                />
              </label>

              {(serverImageError || imageError) && (
                <p className='mt-2 text-sm text-red-600' role='alert'>
                  {serverImageError ?? imageError}
                </p>
              )}

              {imageFile && (
                <div className='mt-3 rounded-xl border border-teal-100 p-3'>
                  <p className='truncate text-xs font-bold text-teal-950'>
                    {imageFile.name}
                  </p>
                  <div className='mt-1 flex items-center justify-between gap-3'>
                    <span className='text-xs text-slate-500'>
                      {formatFileSize(imageFile.size)}
                    </span>
                    <button
                      type='button'
                      onClick={removeSelectedImage}
                      className='text-xs font-bold text-red-600 hover:text-red-800'
                    >
                      Remove selection
                    </button>
                  </div>
                </div>
              )}

              {isEditing && !imageFile && product.image_url && (
                <p className='mt-3 text-xs leading-5 text-slate-500'>
                  The current image is kept unless you choose a replacement.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col-reverse gap-3 border-t border-teal-100 bg-teal-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7'>
          <button
            type='button'
            onClick={onClose}
            disabled={isLoading}
            className='rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isLoading
              ? 'Saving product...'
              : isEditing
                ? 'Save changes'
                : 'Create product'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

function FormField({
  id,
  label,
  error,
  optional = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <div className='mb-2 flex items-center justify-between gap-3'>
        <label className='text-sm font-semibold text-teal-950' htmlFor={id}>
          {label}
        </label>
        {optional && <span className='text-xs text-slate-500'>Optional</span>}
      </div>
      {children}
      {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return `block w-full rounded-xl border bg-white px-4 py-3 text-sm text-teal-950 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-teal-100 focus:border-teal-600 focus:ring-teal-100'
  }`;
}

function formatFileSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.ceil(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CloseIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
      <path strokeLinecap='round' d='m6 6 12 12M18 6 6 18' />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className='h-7 w-7 text-teal-600' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 16V4m0 0L7 9m5-5 5 5M5 14v5h14v-5' />
    </svg>
  );
}
