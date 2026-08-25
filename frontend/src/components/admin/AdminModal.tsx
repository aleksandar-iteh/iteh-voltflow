import { useEffect, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';

interface AdminModalProps {
  children: ReactNode;
  labelledBy: string;
  onClose: () => void;
  canClose?: boolean;
  panelClassName?: string;
}

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function AdminModal({
  children,
  labelledBy,
  onClose,
  canClose = true,
  panelClassName = '',
}: AdminModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const canCloseRef = useRef(canClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    canCloseRef.current = canClose;
  }, [canClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusable = panelRef.current?.querySelector<HTMLElement>(
      FOCUSABLE_ELEMENTS,
    );
    focusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && canCloseRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const elements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
      );

      if (elements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && canClose) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-teal-950/60 p-4 backdrop-blur-sm'
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`w-full max-h-[calc(100dvh-2rem)] rounded-2xl bg-white shadow-2xl outline-none ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
