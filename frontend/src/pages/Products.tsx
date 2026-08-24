import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  ProductCard,
  ProductPagination,
} from '../components/products';
import { useProductStore } from '../stores';
import type {
  ProductQuery,
  ProductSortBy,
  SortDirection,
} from '../types/models';

type StockFilter = 'all' | 'in-stock' | 'out-of-stock';
type SortOption = `${ProductSortBy}:${SortDirection}`;

const DEFAULT_PER_PAGE = 6;
const DEFAULT_SORT: SortOption = 'created_at:desc';

const Products = () => {
  const products = useProductStore((state) => state.products);
  const pagination = useProductStore((state) => state.pagination);
  const storedFilters = useProductStore((state) => state.filters);
  const storedSort = useProductStore((state) => state.sort);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const clearFilters = useProductStore((state) => state.clearFilters);
  const hasRequestedProducts = useRef(false);
  const catalogueRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState(String(storedFilters.search ?? ''));
  const [minPrice, setMinPrice] = useState(String(storedFilters.min_price ?? ''));
  const [maxPrice, setMaxPrice] = useState(String(storedFilters.max_price ?? ''));
  const [stockFilter, setStockFilter] = useState<StockFilter>(
    storedFilters.in_stock === undefined
      ? 'all'
      : storedFilters.in_stock
        ? 'in-stock'
        : 'out-of-stock',
  );
  const [sortOption, setSortOption] = useState<SortOption>(
    `${storedSort.by}:${storedSort.direction}`,
  );
  const [perPage, setPerPage] = useState(
    pagination?.per_page ?? DEFAULT_PER_PAGE,
  );

  useEffect(() => {
    if (hasRequestedProducts.current) {
      return;
    }

    hasRequestedProducts.current = true;
    void fetchProducts({ page: 1, per_page: perPage }).catch(() => undefined);
  }, [fetchProducts, perPage]);

  const currentQuery = (page = 1): ProductQuery => {
    const [sortBy, sortDirection] = sortOption.split(':') as [
      ProductSortBy,
      SortDirection,
    ];

    return {
      search: search.trim() || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      in_stock:
        stockFilter === 'all' ? undefined : stockFilter === 'in-stock',
      sort_by: sortBy,
      sort_direction: sortDirection,
      per_page: perPage,
      page,
    };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void fetchProducts(currentQuery()).catch(() => undefined);
  };

  const handleReset = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setStockFilter('all');
    setSortOption(DEFAULT_SORT);
    setPerPage(DEFAULT_PER_PAGE);
    clearFilters();
    void fetchProducts({
      search: undefined,
      min_price: undefined,
      max_price: undefined,
      in_stock: undefined,
      sort_by: 'created_at',
      sort_direction: 'desc',
      per_page: DEFAULT_PER_PAGE,
      page: 1,
    }).catch(() => undefined);
  };

  const handlePageChange = (page: number) => {
    catalogueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    void fetchProducts({
      page,
      per_page: pagination?.per_page ?? perPage,
    }).catch(() => undefined);
  };

  return (
    <div ref={catalogueRef}>
      <div className='max-w-3xl'>
        <p className='text-sm font-bold uppercase tracking-widest text-teal-600'>
          Find your ride
        </p>
        <h1 className='mt-3 text-3xl font-bold text-teal-950 sm:text-4xl'>
          Electric scooters for every journey
        </h1>
        <p className='mt-4 leading-7 text-slate-600'>
          Search our collection, compare prices, and find a scooter that matches your everyday route.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='mt-8 rounded-2xl border border-teal-100 bg-white p-5 shadow-sm sm:p-6'
      >
        <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-6'>
          <div className='md:col-span-2 lg:col-span-2'>
            <label className='mb-2 block text-sm font-semibold text-teal-950' htmlFor='product-search'>
              Search
            </label>
            <div className='relative'>
              <svg
                className='absolute left-3 top-3.5 h-5 w-5 text-teal-500'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                aria-hidden='true'
              >
                <circle cx='11' cy='11' r='7' />
                <path strokeLinecap='round' d='m20 20-4-4' />
              </svg>
              <input
                id='product-search'
                type='search'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder='Search by name or description'
                className='w-full rounded-xl border border-teal-100 bg-white py-3 pl-10 pr-4 text-sm text-teal-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              />
            </div>
          </div>

          <FilterField label='Minimum price' id='minimum-price'>
            <input
              id='minimum-price'
              type='number'
              min='0'
              step='0.01'
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder='€0'
              className='w-full rounded-xl border border-teal-100 px-3 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
            />
          </FilterField>

          <FilterField label='Maximum price' id='maximum-price'>
            <input
              id='maximum-price'
              type='number'
              min='0'
              step='0.01'
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder='Any price'
              className='w-full rounded-xl border border-teal-100 px-3 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
            />
          </FilterField>

          <FilterField label='Availability' id='stock-filter'>
            <select
              id='stock-filter'
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value as StockFilter)}
              className='w-full rounded-xl border border-teal-100 bg-white px-3 py-3 text-sm text-teal-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
            >
              <option value='all'>All products</option>
              <option value='in-stock'>In stock</option>
              <option value='out-of-stock'>Out of stock</option>
            </select>
          </FilterField>

          <FilterField label='Products per page' id='per-page'>
            <select
              id='per-page'
              value={perPage}
              onChange={(event) => setPerPage(Number(event.target.value))}
              className='w-full rounded-xl border border-teal-100 bg-white px-3 py-3 text-sm text-teal-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
            >
              <option value='6'>6</option>
              <option value='9'>9</option>
              <option value='12'>12</option>
              <option value='24'>24</option>
            </select>
          </FilterField>
        </div>

        <div className='mt-5 flex flex-col gap-4 border-t border-teal-50 pt-5 sm:flex-row sm:items-end sm:justify-between'>
          <div className='w-full sm:max-w-xs'>
            <FilterField label='Sort by' id='product-sort'>
              <select
                id='product-sort'
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className='w-full rounded-xl border border-teal-100 bg-white px-3 py-3 text-sm text-teal-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              >
                <option value='created_at:desc'>Newest first</option>
                <option value='created_at:asc'>Oldest first</option>
                <option value='price:asc'>Price: low to high</option>
                <option value='price:desc'>Price: high to low</option>
                <option value='name:asc'>Name: A to Z</option>
                <option value='name:desc'>Name: Z to A</option>
                <option value='stock_quantity:desc'>Most in stock</option>
              </select>
            </FilterField>
          </div>

          <div className='flex gap-3'>
            <button
              type='button'
              onClick={handleReset}
              disabled={isLoading}
              className='flex-1 rounded-xl border border-teal-200 px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:opacity-50 sm:flex-none'
            >
              Reset
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='flex-1 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-50 sm:flex-none'
            >
              Apply filters
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className='mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700' role='alert'>
          <p className='font-bold'>We could not load the products.</p>
          <p className='mt-1 text-sm'>{error}</p>
          <button
            type='button'
            onClick={() => void fetchProducts(currentQuery()).catch(() => undefined)}
            className='mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500'
          >
            Try again
          </button>
        </div>
      )}

      {!error && (
        <>
          <div className='mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <h2 className='text-xl font-bold text-teal-950'>Available products</h2>
            {pagination && (
              <p className='text-sm text-slate-600'>
                Showing {pagination.from ?? 0}&ndash;{pagination.to ?? 0} of{' '}
                {pagination.total} products
              </p>
            )}
          </div>

          {products.length > 0 ? (
            <div className='mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            !isLoading && pagination && (
              <div className='mt-5 rounded-2xl border border-dashed border-teal-200 bg-white px-6 py-16 text-center'>
                <h2 className='text-xl font-bold text-teal-950'>No products found</h2>
                <p className='mt-2 text-sm text-slate-600'>
                  Try changing or resetting the selected filters.
                </p>
              </div>
            )
          )}

          {pagination && (
            <ProductPagination
              pagination={pagination}
              onPageChange={handlePageChange}
              disabled={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
};

function FilterField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className='mb-2 block text-sm font-semibold text-teal-950' htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default Products;
