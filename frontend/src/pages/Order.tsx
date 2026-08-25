import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductImage } from '../components/products';
import { useAuth } from '../context';
import { formatPrice } from '../lib/formatters';
import { useOrderStore } from '../stores';
import type {
  Order as OrderModel,
  OrderItem,
  OrderStatus,
  UserRole,
} from '../types/models';

const STATUS_DETAILS: Record<
  OrderStatus,
  { label: string; description: string; className: string }
> = {
  pending: {
    label: 'Pending',
    description: 'The order has been received and is waiting to be processed.',
    className: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  processing: {
    label: 'Processing',
    description: 'The order is being prepared for shipment.',
    className: 'border-sky-200 bg-sky-50 text-sky-800',
  },
  shipped: {
    label: 'Shipped',
    description: 'The order has left the warehouse and is on its way.',
    className: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  },
  delivered: {
    label: 'Delivered',
    description: 'The order has been delivered successfully.',
    className: 'border-teal-200 bg-teal-50 text-teal-800',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'The order was cancelled and its reserved stock was restored.',
    className: 'border-red-200 bg-red-50 text-red-700',
  },
};

const FULFILMENT_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
];

const Order = () => {
  const { id } = useParams();
  const orderId = Number(id);
  const validOrderId = Number.isInteger(orderId) && orderId > 0 ? orderId : null;
  const { user, isAdmin } = useAuth();
  const selectedOrder = useOrderStore((state) => state.selectedOrder);
  const isLoading = useOrderStore((state) => state.isLoading);
  const error = useOrderStore((state) => state.error);
  const validationErrors = useOrderStore((state) => state.validationErrors);
  const fetchOrder = useOrderStore((state) => state.fetchOrder);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const clearError = useOrderStore((state) => state.clearError);
  const requestedOrderId = useRef<number | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<{
    orderId: number;
    message: string;
  } | null>(null);
  const [cancelConfirmationOrderId, setCancelConfirmationOrderId] = useState<
    number | null
  >(null);
  const order = selectedOrder?.id === validOrderId ? selectedOrder : null;
  const successMessage =
    successFeedback?.orderId === validOrderId ? successFeedback.message : null;
  const showCancelConfirmation = cancelConfirmationOrderId === validOrderId;

  useEffect(() => {
    clearError();

    if (validOrderId !== null && requestedOrderId.current !== validOrderId) {
      requestedOrderId.current = validOrderId;
      void fetchOrder(validOrderId).catch(() => undefined);
    }

    return clearError;
  }, [clearError, fetchOrder, validOrderId]);

  const handleStatusUpdate = async (status: OrderStatus) => {
    if (!order || isLoading) {
      return;
    }

    clearError();
    setSuccessFeedback(null);

    try {
      const updatedOrder = await updateOrderStatus(order.id, status);
      setCancelConfirmationOrderId(null);
      setSuccessFeedback({
        orderId: updatedOrder.id,
        message: `Order status changed to ${STATUS_DETAILS[updatedOrder.status].label.toLowerCase()}.`,
      });
    } catch {
      return;
    }
  };

  if (validOrderId === null) {
    return (
      <OrderUnavailable
        title='Invalid order address'
        message='The order number in this address is not valid.'
        isAdmin={isAdmin}
      />
    );
  }

  if (error && !order) {
    return (
      <OrderUnavailable
        title='Order not available'
        message={error}
        isAdmin={isAdmin}
        onRetry={() => {
          requestedOrderId.current = validOrderId;
          void fetchOrder(validOrderId).catch(() => undefined);
        }}
      />
    );
  }

  if (!order) {
    return <div className='min-h-96' aria-busy='true' />;
  }

  const allowedTransitions = getAllowedTransitions(user?.role, order.status);
  const statusError = validationErrors.status?.[0];
  const itemCount =
    order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <div>
      <nav
        className='mb-7 flex items-center gap-2 text-sm text-slate-600'
        aria-label='Breadcrumb'
      >
        <Link
          className='font-medium transition hover:text-teal-700'
          to={isAdmin ? '/admin?section=orders' : '/'}
        >
          {isAdmin ? 'Admin' : 'Home'}
        </Link>
        <span aria-hidden='true'>/</span>
        <span className='text-teal-950' aria-current='page'>
          Order #{order.id}
        </span>
      </nav>

      <header className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-sm font-bold uppercase tracking-widest text-teal-600'>
            Order details
          </p>
          <h1 className='mt-3 text-3xl font-bold text-teal-950 sm:text-4xl'>
            Order #{order.id}
          </h1>
          <p className='mt-3 text-sm text-slate-600'>
            Placed {formatDateTime(order.created_at)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <div className='mt-8 grid items-start gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          {successMessage && (
            <div
              className='flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-teal-800'
              role='status'
            >
              <CheckIcon />
              <div>
                <p className='font-bold'>Status updated</p>
                <p className='mt-0.5 text-sm'>{successMessage}</p>
              </div>
            </div>
          )}

          {error && (
            <div
              className='rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700'
              role='alert'
            >
              <p className='font-bold'>The status could not be updated.</p>
              <p className='mt-1 text-sm'>{statusError ?? error}</p>
            </div>
          )}

          <OrderProgress status={order.status} />

          <section className='overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm'>
            <div className='flex items-center justify-between gap-4 border-b border-teal-100 px-5 py-4 sm:px-7'>
              <div>
                <h2 className='text-xl font-bold text-teal-950'>Order items</h2>
                <p className='mt-1 text-sm text-slate-500'>
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in this order
                </p>
              </div>
            </div>

            {order.items && order.items.length > 0 ? (
              <ul className='divide-y divide-teal-100'>
                {order.items.map((item) => (
                  <OrderItemRow key={item.id} item={item} isAdmin={isAdmin} />
                ))}
              </ul>
            ) : (
              <p className='px-5 py-10 text-center text-sm text-slate-600 sm:px-7'>
                No items are available for this order.
              </p>
            )}

            <div className='flex items-center justify-between gap-4 bg-teal-50 px-5 py-5 sm:px-7'>
              <span className='font-bold text-teal-950'>Order total</span>
              <span className='text-2xl font-bold text-teal-700'>
                {formatPrice(order.total_price)}
              </span>
            </div>
          </section>
        </div>

        <aside className='space-y-6 lg:sticky lg:top-24'>
          <StatusActions
            order={order}
            allowedTransitions={allowedTransitions}
            isLoading={isLoading}
            showCancelConfirmation={showCancelConfirmation}
            onShowCancelConfirmation={() => setCancelConfirmationOrderId(order.id)}
            onHideCancelConfirmation={() => setCancelConfirmationOrderId(null)}
            onUpdate={handleStatusUpdate}
          />

          <section className='rounded-2xl border border-teal-100 bg-white p-6 shadow-sm'>
            <div className='flex items-center gap-3'>
              <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700'>
                <LocationIcon />
              </span>
              <h2 className='text-lg font-bold text-teal-950'>Shipping address</h2>
            </div>
            <address className='mt-4 whitespace-pre-line break-words text-sm not-italic leading-6 text-slate-600'>
              {order.shipping_address}
            </address>
          </section>

          {isAdmin && (
            <section className='rounded-2xl border border-teal-100 bg-white p-6 shadow-sm'>
              <div className='flex items-center gap-3'>
                <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700'>
                  <UserIcon />
                </span>
                <h2 className='text-lg font-bold text-teal-950'>Customer</h2>
              </div>
              <dl className='mt-4 space-y-3 text-sm'>
                <div>
                  <dt className='text-slate-500'>Name</dt>
                  <dd className='mt-0.5 break-words font-semibold text-teal-950'>
                    {order.user?.name ?? `User #${order.user_id}`}
                  </dd>
                </div>
                {order.user?.email && (
                  <div>
                    <dt className='text-slate-500'>Email</dt>
                    <dd className='mt-0.5 break-all font-semibold text-teal-950'>
                      {order.user.email}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          <section className='rounded-2xl border border-teal-100 bg-white p-6 shadow-sm'>
            <h2 className='text-lg font-bold text-teal-950'>Order information</h2>
            <dl className='mt-4 space-y-3 text-sm'>
              <InfoRow label='Order number' value={`#${order.id}`} />
              <InfoRow label='Created' value={formatDateTime(order.created_at)} />
              <InfoRow label='Last updated' value={formatDateTime(order.updated_at)} />
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
};

interface StatusActionsProps {
  order: OrderModel;
  allowedTransitions: OrderStatus[];
  isLoading: boolean;
  showCancelConfirmation: boolean;
  onShowCancelConfirmation: () => void;
  onHideCancelConfirmation: () => void;
  onUpdate: (status: OrderStatus) => Promise<void>;
}

function StatusActions({
  order,
  allowedTransitions,
  isLoading,
  showCancelConfirmation,
  onShowCancelConfirmation,
  onHideCancelConfirmation,
  onUpdate,
}: StatusActionsProps) {
  const nonCancellationTransitions = allowedTransitions.filter(
    (status) => status !== 'cancelled',
  );
  const canCancel = allowedTransitions.includes('cancelled');

  return (
    <section className='rounded-2xl border border-teal-100 bg-white p-6 shadow-sm'>
      <h2 className='text-lg font-bold text-teal-950'>Update status</h2>
      <p className='mt-2 text-sm leading-6 text-slate-600'>
        {STATUS_DETAILS[order.status].description}
      </p>

      {allowedTransitions.length > 0 ? (
        <div className='mt-5 space-y-3'>
          {nonCancellationTransitions.map((status) => (
            <button
              key={status}
              type='button'
              onClick={() => void onUpdate(status)}
              disabled={isLoading}
              className='w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
            >
              Mark as {STATUS_DETAILS[status].label.toLowerCase()}
            </button>
          ))}

          {canCancel && !showCancelConfirmation && (
            <button
              type='button'
              onClick={onShowCancelConfirmation}
              disabled={isLoading}
              className='w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
            >
              Cancel order
            </button>
          )}

          {canCancel && showCancelConfirmation && (
            <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
              <p className='text-sm font-bold text-red-800'>Cancel this order?</p>
              <p className='mt-1 text-xs leading-5 text-red-700'>
                This action changes the order permanently and restores its product stock.
              </p>
              <div className='mt-3 grid grid-cols-2 gap-2'>
                <button
                  type='button'
                  onClick={onHideCancelConfirmation}
                  disabled={isLoading}
                  className='rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60'
                >
                  Keep order
                </button>
                <button
                  type='button'
                  onClick={() => void onUpdate('cancelled')}
                  disabled={isLoading}
                  className='rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60'
                >
                  Confirm cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className='mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600'>
          No further status changes are available.
        </p>
      )}
    </section>
  );
}

function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <section className='rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-7'>
        <div className='flex items-start gap-4 text-red-700'>
          <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100'>
            <CancelledIcon />
          </span>
          <div>
            <h2 className='text-lg font-bold'>Order cancelled</h2>
            <p className='mt-1 text-sm leading-6'>
              This order will not be fulfilled. The quantities reserved by the order have been returned to stock.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentIndex = FULFILMENT_STATUSES.indexOf(status);

  return (
    <section className='rounded-2xl border border-teal-100 bg-white p-6 shadow-sm sm:p-7'>
      <h2 className='text-xl font-bold text-teal-950'>Order progress</h2>
      <ol className='mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4'>
        {FULFILMENT_STATUSES.map((progressStatus, index) => {
          const isReached = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={progressStatus} className='relative'>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                  isReached
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                } ${isCurrent ? 'ring-4 ring-teal-100' : ''}`}
              >
                {isReached && !isCurrent ? <SmallCheckIcon /> : index + 1}
              </span>
              <p
                className={`mt-3 text-sm font-bold ${
                  isReached ? 'text-teal-950' : 'text-slate-400'
                }`}
              >
                {STATUS_DETAILS[progressStatus].label}
              </p>
              {isCurrent && (
                <span className='mt-1 block text-xs font-semibold text-teal-600'>
                  Current status
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function OrderItemRow({ item, isAdmin }: { item: OrderItem; isAdmin: boolean }) {
  const product = item.product ?? {
    name: `Product #${item.product_id}`,
    image_url: null,
  };
  const productName = (
    <span className='line-clamp-2 text-sm font-bold leading-5 text-teal-950 sm:text-base'>
      {product.name}
    </span>
  );

  return (
    <li className='flex gap-4 px-5 py-5 sm:items-center sm:px-7'>
      <ProductImage
        product={product}
        className='h-20 w-20 shrink-0 rounded-xl border border-teal-100 sm:h-24 sm:w-24'
        imageClassName='p-2'
      />
      <div className='min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-5'>
        <div className='min-w-0'>
          {isAdmin ? (
            productName
          ) : (
            <Link className='transition hover:text-teal-700' to={`/product/${item.product_id}`}>
              {productName}
            </Link>
          )}
          <p className='mt-2 text-xs text-slate-500 sm:text-sm'>
            {formatPrice(item.unit_price)} each · Quantity {item.quantity}
          </p>
        </div>
        <p className='mt-3 shrink-0 font-bold text-teal-700 sm:mt-0 sm:text-lg'>
          {formatPrice(lineTotal(item.unit_price, item.quantity))}
        </p>
      </div>
    </li>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const details = STATUS_DETAILS[status];

  return (
    <span
      className={`w-fit rounded-full border px-4 py-2 text-sm font-bold ${details.className}`}
    >
      {details.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <dt className='text-slate-500'>{label}</dt>
      <dd className='text-right font-semibold text-teal-950'>{value}</dd>
    </div>
  );
}

function OrderUnavailable({
  title,
  message,
  isAdmin,
  onRetry,
}: {
  title: string;
  message: string;
  isAdmin: boolean;
  onRetry?: () => void;
}) {
  return (
    <div className='mx-auto max-w-2xl rounded-3xl border border-teal-100 bg-white px-6 py-16 text-center shadow-sm sm:px-10'>
      <span className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-600'>
        <OrderIcon />
      </span>
      <h1 className='mt-6 text-3xl font-bold text-teal-950'>{title}</h1>
      <p className='mx-auto mt-3 max-w-lg leading-7 text-slate-600'>{message}</p>
      <div className='mt-7 flex flex-wrap justify-center gap-3'>
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
          to={isAdmin ? '/admin?section=orders' : '/'}
          className='rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700'
        >
          {isAdmin ? 'Back to admin' : 'Back to home'}
        </Link>
      </div>
    </div>
  );
}

function getAllowedTransitions(
  role: UserRole | undefined,
  status: OrderStatus,
): OrderStatus[] {
  if (role === 'admin') {
    const adminTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
    };

    return adminTransitions[status] ?? [];
  }

  return role === 'user' && status === 'pending' ? ['cancelled'] : [];
}

function lineTotal(price: string, quantity: number): number {
  return (Math.round(Number(price) * 100) * quantity) / 100;
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function CheckIcon() {
  return (
    <svg className='mt-0.5 h-5 w-5 shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='m5 12 4 4L19 6' />
    </svg>
  );
}

function SmallCheckIcon() {
  return (
    <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='m5 12 4 4L19 6' />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 21s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12Z' />
      <circle cx='12' cy='9' r='2.5' />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='12' cy='8' r='4' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 21a7.5 7.5 0 0 1 15 0' />
    </svg>
  );
}

function CancelledIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
      <path strokeLinecap='round' d='m8 8 8 8M16 8l-8 8' />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg className='h-10 w-10' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.7' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M7 3h10l2 4v14H5V7l2-4Z' />
      <path strokeLinecap='round' d='M5 8h14M9 12h6' />
    </svg>
  );
}

export default Order;
