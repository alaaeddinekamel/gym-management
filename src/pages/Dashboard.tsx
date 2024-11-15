import React from 'react';
import { Activity, Calendar, ShoppingBag, Trophy, Package } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useScheduleStore } from '../store/scheduleStore';
import { useOrderStore } from '../store/orderStore';

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const schedules = useScheduleStore((state) => state.schedules);
  const orders = useOrderStore((state) => state.orders);

  // Filter sessions for current user
  const userSessions = schedules
    .filter(schedule => schedule.userId === user?.id)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Filter orders for current user
  const userOrders = orders
    .filter(order => order.userId === user?.id)
    .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's your fitness journey overview</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Workouts Completed"
          value="24"
          change="+3"
          icon={<Activity className="h-6 w-6" />}
        />
        <StatCard
          title="Next Session"
          value="Tomorrow, 9 AM"
          icon={<Calendar className="h-6 w-6" />}
        />
        <StatCard
          title="Active Goals"
          value="3"
          change="+1"
          icon={<Trophy className="h-6 w-6" />}
        />
        <StatCard
          title="Store Credits"
          value="$50"
          icon={<ShoppingBag className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingSchedule sessions={userSessions} />
        <RecentOrders orders={userOrders} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <WorkoutProgress />
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon 
}: { 
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {change && (
          <span className="text-green-500 text-sm">{change} this week</span>
        )}
      </div>
      <div className="text-blue-600">{icon}</div>
    </div>
  </div>
);

const UpcomingSchedule = ({ sessions }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No upcoming sessions</p>
      ) : (
        sessions.slice(0, 3).map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">{session.type}</p>
                <p className="text-sm text-gray-500">
                  {session.date.toLocaleDateString()} at {session.time}
                </p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              session.status === 'scheduled'
                ? 'bg-green-100 text-green-800'
                : session.status === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {session.status}
            </span>
          </div>
        ))
      )}
    </div>
  </div>
);

const RecentOrders = ({ orders }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No orders yet</p>
      ) : (
        orders.slice(0, 3).map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {order.orderDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {order.products.length} items - ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              order.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : order.status === 'confirmed'
                ? 'bg-blue-100 text-blue-800'
                : order.status === 'delivered'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {order.status}
            </span>
          </div>
        ))
      )}
    </div>
  </div>
);

const WorkoutProgress = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h2 className="text-lg font-semibold mb-4">Workout Progress</h2>
    <div className="space-y-4">
      {['Strength', 'Cardio', 'Flexibility'].map((category) => (
        <div key={category} className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{category}</span>
            <span className="text-sm text-gray-500">75%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);