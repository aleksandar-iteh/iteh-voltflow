import type { AdminSection } from './types';

interface AdminTabsProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const tabs: { id: AdminSection; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
];

export function AdminTabs({
  activeSection,
  onSectionChange,
}: AdminTabsProps) {
  return (
    <div className='overflow-x-auto border-b border-teal-100'>
      <div
        className='flex min-w-max gap-1 px-2 sm:px-4'
        role='tablist'
        aria-label='Admin sections'
      >
        {tabs.map((tab) => {
          const isActive = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              type='button'
              role='tab'
              aria-selected={isActive}
              aria-controls={`admin-panel-${tab.id}`}
              onClick={() => onSectionChange(tab.id)}
              className={`relative px-5 py-4 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 ${
                isActive
                  ? 'text-teal-700 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-teal-600'
                  : 'text-slate-500 hover:bg-teal-50 hover:text-teal-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
