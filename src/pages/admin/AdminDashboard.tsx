import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Users, ShoppingBag, Calendar, Activity, Package } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { CoachManagement } from './CoachManagement';
import { ProductManagement } from './ProductManagement';
import { ScheduleManagement } from './ScheduleManagement';
import { OrderManagement } from './OrderManagement';

export const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-2 bg-white rounded-lg shadow-sm p-4 h-[calc(100vh-8rem)]">
        <nav className="space-y-2">
          <NavLink to="/admin/users" icon={<Users className="h-5 w-5" />} label="Users" />
          <NavLink to="/admin/coaches" icon={<Activity className="h-5 w-5" />} label="Coaches" />
          <NavLink to="/admin/products" icon={<ShoppingBag className="h-5 w-5" />} label="Products" />
          <NavLink to="/admin/schedule" icon={<Calendar className="h-5 w-5" />} label="Schedule" />
          <NavLink to="/admin/orders" icon={<Package className="h-5 w-5" />} label="Orders" />
        </nav>
      </aside>

      <main className="col-span-10">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="coaches" element={<CoachManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="schedule" element={<ScheduleManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route index element={<AdminOverview />} />
        </Routes>
      </main>
    </div>
  );
};

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-50 text-gray-700 hover:text-blue-600"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const AdminOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard title="Total Users" value="1,234" icon={<Users className="h-8 w-8" />} />
    <StatCard title="Active Coaches" value="45" icon={<Activity className="h-8 w-8" />} />
    <StatCard title="Products" value="89" icon={<ShoppingBag className="h-8 w-8" />} />
    <StatCard title="Sessions Today" value="156" icon={<Calendar className="h-8 w-8" />} />
  </div>
);

const StatCard = ({ 
  title, 
  value, 
  icon 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="text-blue-600">{icon}</div>
    </div>
  </div>
);