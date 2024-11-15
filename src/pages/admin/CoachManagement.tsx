import React, { useState } from 'react';
import { User, Edit, Trash2, Plus, X } from 'lucide-react';
import { Coach } from '../../types';
import { useUserStore } from '../../store/userStore';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00'];
const specializations = [
  'Strength Training',
  'CrossFit',
  'Yoga',
  'Personal Training',
  'Cardio',
  'Nutrition'
];

export const CoachManagement = () => {
  const { coaches, users, addCoach, updateCoach, deleteCoach } = useUserStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [formData, setFormData] = useState<Partial<Coach>>({
    userId: '',
    specialization: [],
    experience: 0,
    availability: []
  });

  const coachUsers = users.filter(user => user.role === 'coach');

  const handleOpenModal = (coach?: Coach) => {
    if (coach) {
      setEditingCoach(coach);
      setFormData(coach);
    } else {
      setEditingCoach(null);
      setFormData({
        userId: '',
        specialization: [],
        experience: 0,
        availability: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoach(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoach) {
      updateCoach(editingCoach.id, formData);
    } else {
      const newCoach: Coach = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData as Omit<Coach, 'id'>
      };
      addCoach(newCoach);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coach?')) {
      deleteCoach(id);
    }
  };

  const handleSpecializationChange = (spec: string) => {
    const currentSpecs = formData.specialization || [];
    if (currentSpecs.includes(spec)) {
      setFormData({
        ...formData,
        specialization: currentSpecs.filter(s => s !== spec)
      });
    } else {
      setFormData({
        ...formData,
        specialization: [...currentSpecs, spec]
      });
    }
  };

  const handleAvailabilityChange = (day: string, slots: string[]) => {
    const currentAvailability = formData.availability || [];
    const dayIndex = currentAvailability.findIndex(a => a.day === day);
    
    if (dayIndex >= 0) {
      const newAvailability = [...currentAvailability];
      newAvailability[dayIndex] = { day, slots };
      setFormData({ ...formData, availability: newAvailability });
    } else {
      setFormData({
        ...formData,
        availability: [...currentAvailability, { day, slots }]
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Coach Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Coach</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coach
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coaches.map((coach) => {
              const coachUser = users.find(user => user.id === coach.userId);
              return (
                <tr key={coach.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <User className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {coachUser?.name || 'Unknown Coach'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {coachUser?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {coach.specialization.map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{coach.experience} years</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {coach.availability.map((av) => (
                        <div key={av.day} className="mb-1">
                          <span className="font-medium">{av.day}:</span>{' '}
                          <span className="text-gray-500">
                            {av.slots.length} slots
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(coach)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(coach.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Coach Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingCoach ? 'Edit Coach' : 'Add Coach'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select User</label>
                <select
                  value={formData.userId || ''}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select a user</option>
                  {coachUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {specializations.map((spec) => (
                    <label key={spec} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(formData.specialization || []).includes(spec)}
                        onChange={() => handleSpecializationChange(spec)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Experience (years)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience || 0}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="space-y-4">
                  {weekDays.map((day) => {
                    const dayAvailability = (formData.availability || []).find(a => a.day === day);
                    return (
                      <div key={day} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{day}</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((slot) => (
                            <label key={slot} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={dayAvailability?.slots.includes(slot) || false}
                                onChange={(e) => {
                                  const currentSlots = dayAvailability?.slots || [];
                                  const newSlots = e.target.checked
                                    ? [...currentSlots, slot]
                                    : currentSlots.filter(s => s !== slot);
                                  handleAvailabilityChange(day, newSlots);
                                }}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{slot}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                {editingCoach ? 'Update Coach' : 'Add Coach'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};