import { create } from 'zustand';
import { WorkoutSchedule } from '../types';

interface ScheduleStore {
  schedules: WorkoutSchedule[];
  addSchedule: (schedule: WorkoutSchedule) => void;
  updateScheduleStatus: (scheduleId: string, status: WorkoutSchedule['status']) => void;
  cancelSchedule: (scheduleId: string) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  schedules: [],
  addSchedule: (schedule) => {
    set((state) => ({
      schedules: [...state.schedules, {
        ...schedule,
        date: new Date(schedule.date) // Ensure date is a Date object
      }]
    }));
  },
  updateScheduleStatus: (scheduleId, status) =>
    set((state) => ({
      schedules: state.schedules.map(schedule =>
        schedule.id === scheduleId
          ? { ...schedule, status }
          : schedule
      ),
    })),
  cancelSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.map(schedule =>
        schedule.id === scheduleId
          ? { ...schedule, status: 'cancelled' }
          : schedule
      ),
    })),
}));