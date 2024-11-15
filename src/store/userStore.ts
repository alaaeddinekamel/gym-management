import { create } from 'zustand';
import { User, Coach } from '../types';

interface UserStore {
  users: User[];
  coaches: Coach[];
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addCoach: (coach: Coach) => void;
  updateCoach: (id: string, coach: Partial<Coach>) => void;
  deleteCoach: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      membershipStatus: 'active',
      joinDate: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'coach',
      membershipStatus: 'active',
      joinDate: new Date('2024-02-01'),
    }
  ],
  coaches: [
    {
      id: '1',
      userId: '2',
      specialization: ['Strength Training', 'CrossFit'],
      experience: 5,
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
    }
  ],
  addUser: (user) => 
    set((state) => ({
      users: [...state.users, user]
    })),
  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map(user =>
        user.id === id
          ? { ...user, ...updatedUser }
          : user
      )
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter(user => user.id !== id),
      coaches: state.coaches.filter(coach => coach.userId !== id)
    })),
  addCoach: (coach) =>
    set((state) => ({
      coaches: [...state.coaches, coach]
    })),
  updateCoach: (id, updatedCoach) =>
    set((state) => ({
      coaches: state.coaches.map(coach =>
        coach.id === id
          ? { ...coach, ...updatedCoach }
          : coach
      )
    })),
  deleteCoach: (id) =>
    set((state) => ({
      coaches: state.coaches.filter(coach => coach.id !== id)
    })),
}));