import { useSearchParams } from 'react-router-dom';
import {
  AdminTabs,
  OrdersSection,
  OverviewSection,
  ProductsSection,
  UsersSection,
  isAdminSection,
} from '../components/admin';
import type { AdminSection } from '../components/admin';

const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSection = searchParams.get('section');
  const activeSection = isAdminSection(requestedSection)
    ? requestedSection
    : 'overview';

  const handleSectionChange = (section: AdminSection) => {
    setSearchParams(section === 'overview' ? {} : { section }, { replace: true });
  };

  return (
    <div>
      <div className='max-w-3xl'>
        <p className='text-sm font-bold uppercase tracking-widest text-teal-600'>
          VoltFlow management
        </p>
        <h1 className='mt-3 text-3xl font-bold text-teal-950 sm:text-4xl'>
          Admin dashboard
        </h1>
        <p className='mt-4 leading-7 text-slate-600'>
          Manage store activity, customers, products, and orders from one place.
        </p>
      </div>

      <div className='mt-8 overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm'>
        <AdminTabs
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <AdminSectionContent section={activeSection} />
      </div>
    </div>
  );
};

function AdminSectionContent({ section }: { section: AdminSection }) {
  switch (section) {
    case 'users':
      return <UsersSection />;
    case 'products':
      return <ProductsSection />;
    case 'orders':
      return <OrdersSection />;
    default:
      return <OverviewSection />;
  }
}

export default Admin;
