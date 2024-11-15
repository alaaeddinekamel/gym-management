import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [error, setError] = React.useState<string>('');

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      login(result.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <div className="flex items-center justify-center mb-8">
          <UserPlus className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold ml-2">Register</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === watch('password') || 'Passwords do not match'
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};