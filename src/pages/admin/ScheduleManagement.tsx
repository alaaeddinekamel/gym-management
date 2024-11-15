import React from 'react';
import { Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { useScheduleStore } from '../../store/scheduleStore';

export const ScheduleManagement = () => {
  const schedules = useScheduleStore((state) => state.schedules);
  const updateScheduleStatus = useScheduleStore((state) => state.updateScheduleStatus);
  const cancelSchedule = useScheduleStore((state) => state.cancelSchedule);

  const handleStatusChange = (scheduleId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    updateScheduleStatus(scheduleId, status);
  };

  const handleCancelSchedule = (scheduleId: string) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      cancelSchedule(scheduleId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Schedule Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Session</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coach
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No sessions scheduled
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Calendar className="h-10 w-10 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {schedule.type}
                        </div>
                        <div className="text-sm text-gray-500">
                          User ID: {schedule.userId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.date.toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{schedule.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      Coach #{schedule.coachId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={schedule.status}
                      onChange={(e) => handleStatusChange(schedule.id, e.target.value as any)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        schedule.status === 'scheduled'
                          ? 'bg-green-100 text-green-800'
                          : schedule.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleCancelSchedule(schedule.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};