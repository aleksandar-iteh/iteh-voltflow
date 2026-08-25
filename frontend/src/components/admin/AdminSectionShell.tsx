import type { ReactNode } from 'react';
import type { AdminSection } from './types';

interface AdminSectionShellProps {
  section: AdminSection;
  title: string;
  description: string;
  icon: ReactNode;
}

export function AdminSectionShell({
  section,
  title,
  description,
  icon,
}: AdminSectionShellProps) {
  return (
    <section
      id={`admin-panel-${section}`}
      role='tabpanel'
      aria-labelledby={`admin-tab-${section}`}
      tabIndex={0}
      className='p-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 sm:p-8'
    >
      <div className='flex flex-col gap-5 sm:flex-row sm:items-start'>
        <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700'>
          {icon}
        </span>
        <div>
          <h2 className='text-2xl font-bold text-teal-950'>{title}</h2>
          <p className='mt-2 max-w-2xl leading-7 text-slate-600'>{description}</p>
        </div>
      </div>

      <div className='mt-8 rounded-2xl border border-dashed border-teal-200 bg-teal-50 px-6 py-12 text-center'>
        <p className='text-sm font-semibold text-teal-800'>
          The {title.toLowerCase()} section is ready for implementation.
        </p>
      </div>
    </section>
  );
}
