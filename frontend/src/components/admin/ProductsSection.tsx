import { useCallback, useEffect, useRef, useState } from 'react';
import { useProductStore } from '../../stores';
import type { Product } from '../../types/models';
import { AdminProductPagination } from './AdminProductPagination';
import { AdminProductTable } from './AdminProductTable';
import { AdminSectionShell } from './AdminSectionShell';
import { DeleteProductModal } from './DeleteProductModal';
import { ProductFormModal } from './ProductFormModal';

const PRODUCTS_PER_PAGE = 10;
type ProductFormTarget = Product | 'create' | null;

export function ProductsSection() {
  const products = useProductStore((state) => state.products);
  const pagination = useProductStore((state) => state.pagination);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const clearError = useProductStore((state) => state.clearError);
  const hasRequestedProducts = useRef(false);
  const [formTarget, setFormTarget] = useState<ProductFormTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchAdminProducts = useCallback(
    (page: number) =>
      fetchProducts({
        search: undefined,
        min_price: undefined,
        max_price: undefined,
        in_stock: undefined,
        sort_by: 'created_at',
        sort_direction: 'desc',
        per_page: PRODUCTS_PER_PAGE,
        page,
      }),
    [fetchProducts],
  );

  useEffect(() => {
    if (hasRequestedProducts.current) {
      return;
    }

    hasRequestedProducts.current = true;
    void fetchAdminProducts(1).catch(() => undefined);
  }, [fetchAdminProducts]);

  const openCreateModal = () => {
    clearError();
    setNotice(null);
    setFormTarget('create');
  };

  const openEditModal = (product: Product) => {
    clearError();
    setNotice(null);
    setFormTarget(product);
  };

  const closeFormModal = () => {
    clearError();
    setFormTarget(null);
  };

  const openDeleteModal = (product: Product) => {
    clearError();
    setNotice(null);
    setDeleteTarget(product);
  };

  const closeDeleteModal = () => {
    clearError();
    setDeleteTarget(null);
  };

  const handleProductSaved = (
    product: Product,
    mode: 'create' | 'edit',
  ) => {
    const page = mode === 'create' ? 1 : (pagination?.current_page ?? 1);
    setFormTarget(null);
    clearError();
    setNotice(
      mode === 'create'
        ? `${product.name} was created successfully.`
        : `${product.name} was updated successfully.`,
    );
    void fetchAdminProducts(page).catch(() => undefined);
  };

  const handleProductDeleted = (product: Product) => {
    const currentPage = pagination?.current_page ?? 1;
    const nextPage =
      products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
    setDeleteTarget(null);
    clearError();
    setNotice(`${product.name} was deleted successfully.`);
    void fetchAdminProducts(nextPage).catch(() => undefined);
  };

  const handlePageChange = (page: number) => {
    if (isLoading || page < 1 || (pagination && page > pagination.last_page)) {
      return;
    }

    setNotice(null);
    void fetchAdminProducts(page).catch(() => undefined);
  };

  const modalIsOpen = formTarget !== null || deleteTarget !== null;
  const listError = !modalIsOpen ? error : null;

  return (
    <AdminSectionShell
      section='products'
      title='Products'
      description='Manage the electric scooter catalogue, product details, pricing, stock, and images.'
      icon={<ProductsIcon />}
    >
      <div className='mt-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h3 className='text-lg font-bold text-teal-950'>Product catalogue</h3>
            {pagination && !listError && (
              <p className='mt-1 text-sm text-slate-600'>
                Showing {pagination.from ?? 0}&ndash;{pagination.to ?? 0} of{' '}
                {pagination.total} products
              </p>
            )}
          </div>
          <button
            type='button'
            onClick={openCreateModal}
            disabled={isLoading}
            className='inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
          >
            <PlusIcon />
            Create product
          </button>
        </div>

        {notice && (
          <div
            className='mt-5 flex items-start justify-between gap-4 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800'
            role='status'
          >
            <div className='flex items-start gap-3'>
              <CheckIcon />
              <p className='font-semibold'>{notice}</p>
            </div>
            <button
              type='button'
              onClick={() => setNotice(null)}
              className='shrink-0 font-bold text-teal-700 hover:text-teal-950'
              aria-label='Dismiss message'
            >
              &times;
            </button>
          </div>
        )}

        {listError && (
          <div
            className='mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700'
            role='alert'
          >
            <p className='font-bold'>We could not load the products.</p>
            <p className='mt-1 text-sm'>{listError}</p>
            <button
              type='button'
              onClick={() => void fetchAdminProducts(1).catch(() => undefined)}
              disabled={isLoading}
              className='mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60'
            >
              Try again
            </button>
          </div>
        )}

        {!listError && pagination && (
          <div className='mt-5'>
            {products.length > 0 ? (
              <AdminProductTable
                products={products}
                disabled={isLoading}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ) : (
              <div className='rounded-2xl border border-dashed border-teal-200 bg-teal-50 px-6 py-12 text-center'>
                <h3 className='text-lg font-bold text-teal-950'>No products yet</h3>
                <p className='mt-2 text-sm text-slate-600'>
                  Create the first product to start building the VoltFlow catalogue.
                </p>
                <button
                  type='button'
                  onClick={openCreateModal}
                  className='mt-5 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
                >
                  Create product
                </button>
              </div>
            )}

            <AdminProductPagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              disabled={isLoading}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {!listError && !pagination && <div className='min-h-40' aria-busy='true' />}
      </div>

      {formTarget !== null && (
        <ProductFormModal
          key={formTarget === 'create' ? 'create' : formTarget.id}
          product={formTarget === 'create' ? null : formTarget}
          onClose={closeFormModal}
          onSaved={handleProductSaved}
        />
      )}

      {deleteTarget && (
        <DeleteProductModal
          product={deleteTarget}
          onClose={closeDeleteModal}
          onDeleted={handleProductDeleted}
        />
      )}
    </AdminSectionShell>
  );
}

function ProductsIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='6' cy='18' r='2' />
      <circle cx='18' cy='18' r='2' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18h10L13 5h4M13 5h5M9 18l2-8h3' />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className='h-4 w-4' viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
      <path strokeLinecap='round' d='M10 4v12M4 10h12' />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className='mt-0.5 h-4 w-4 shrink-0' viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='2.2' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='m3.5 10 4 4 9-9' />
    </svg>
  );
}
