export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'coach';
  membershipStatus?: 'active' | 'inactive';
  joinDate: Date;
}

export interface Coach {
  id: string;
  userId: string;
  specialization: string[];
  experience: number;
  availability: {
    day: string;
    slots: string[];
  }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'delivered';
  orderDate: Date;
}

export interface WorkoutSchedule {
  id: string;
  userId: string;
  coachId: string;
  date: Date;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}