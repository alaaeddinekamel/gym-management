import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useScheduleStore } from '../../store/scheduleStore';

// Session types data
const sessionTypes = [
  'Personal Training',
  'Group Training',
  'Yoga',
  'CrossFit',
  'Strength Training',
  'Cardio'
];

// Mock coaches data
const coaches = [
  {
    id: '1',
    name: 'John Smith',
    specialization: ['Strength Training', 'CrossFit'],
    availability: [
      {
        day: 'Monday',
        slots: ['09:00', '10:00', '11:00', '14:00', '15:00']
      },
      {
        day: 'Wednesday',
        slots: ['09:00', '10:00', '11:00', '14:00', '15:00']
      },
      {
        day: 'Friday',
        slots: ['09:00', '10:00', '11:00', '14:00', '15:00']
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    specialization: ['Yoga', 'Personal Training'],
    availability: [
      {
        day: 'Tuesday',
        slots: ['09:00', '10:00', '11:00', '14:00', '15:00']
      },
      {
        day: 'Thursday',
        slots: ['09:00', '10:00', '11:00', '14:00', '15:00']
      },
      {
        day: 'Saturday',
        slots: ['09:00', '10:00', '11:00']
      }
    ]
  }
];

// Available time slots
const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00'
];

export const Schedule = () => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const user = useAuthStore(state => state.user);
  const { schedules, addSchedule } = useScheduleStore();

  // Filter user's schedules
  const userSchedules = schedules.filter(schedule => schedule.userId === user?.id);

  const handleBookSession = () => {
    if (!user) {
      alert('Please log in to book a session');
      return;
    }

    if (!selectedType || !selectedCoach || !selectedDate || !selectedTime) {
      alert('Please fill in all fields');
      return;
    }

    const selectedCoachData = coaches.find(coach => coach.id === selectedCoach);
    if (!selectedCoachData) {
      alert('Invalid coach selection');
      return;
    }

    // Create a Date object from the selected date
    const scheduleDate = new Date(selectedDate);
    const dayOfWeek = scheduleDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Check if the coach is available on the selected day and time
    const coachAvailability = selectedCoachData.availability.find(
      av => av.day.toLowerCase() === dayOfWeek.toLowerCase()
    );

    if (!coachAvailability || !coachAvailability.slots.includes(selectedTime)) {
      alert('Selected time slot is not available for this coach');
      return;
    }

    // Check if there's already a booking for this time slot
    const existingBooking = schedules.find(
      schedule =>
        schedule.date.toDateString() === scheduleDate.toDateString() &&
        schedule.time === selectedTime &&
        schedule.coachId === selectedCoach
    );

    if (existingBooking) {
      alert('This time slot is already booked');
      return;
    }

    const newSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      coachId: selectedCoach,
      date: scheduleDate,
      time: selectedTime,
      type: selectedType,
      status: 'scheduled' as const
    };

    try {
      addSchedule(newSchedule);
      alert('Session booked successfully!');
      
      // Reset form and close modal
      setSelectedType('');
      setSelectedCoach('');
      setSelectedDate('');
      setSelectedTime('');
      setShowBookingModal(false);
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Get sessions for a specific day
  const getSessionsForDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return userSchedules.filter(
      schedule => schedule.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <button
          onClick={() => setShowBookingModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Book Session
        </button>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold p-2">
              {day}
            </div>
          ))}

          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="p-2"></div>
          ))}

          {days.map((day) => {
            const sessions = getSessionsForDay(day);
            return (
              <div
                key={day}
                className={`min-h-[100px] p-2 border border-gray-100 ${
                  sessions.length > 0 ? 'bg-blue-50' : ''
                }`}
              >
                <div className="font-medium mb-1">{day}</div>
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="text-xs p-1 rounded bg-blue-100 text-blue-800"
                    >
                      {session.type} - {session.time}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-semibold mb-6">Book a Session</h2>
            <div className="space-y-6">
              {/* Session Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select a session type</option>
                  {sessionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Coach Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Coach
                </label>
                <select
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select a coach</option>
                  {coaches.map((coach) => (
                    <option key={coach.id} value={coach.id}>{coach.name}</option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleBookSession}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};