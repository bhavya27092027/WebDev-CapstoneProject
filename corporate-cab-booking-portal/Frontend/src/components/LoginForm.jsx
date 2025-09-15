import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car, Eye, EyeOff, Building, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['company', 'vendor'], { required_error: 'Please select a role' })
});

const LoginForm = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data) => {
  try {
    const res = await fetch('http://localhost:5173/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      // Store JWT token & user info in localStorage
      localStorage.setItem('user', JSON.stringify({
        token: result.token,
        email: result.user.email,
        role: result.user.role,
        name: result.user.name
      }));

      // Navigate to home without reload
      onLoginSuccess(result.user); 
    } else {
      alert(result.message || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server error while logging in');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-700 p-3 rounded-xl">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-['Poppins']">Welcome to CabPortal</h2>
          <p className="text-sm text-gray-600 font-['Lato']">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-['Lato'] mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => handleRoleSelect('company')}
                className={`p-4 rounded-lg border flex flex-col items-center ${selectedRole === 'company'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <Building className="h-6 w-6" />
                <span className="text-sm font-['Lato']">Company</span>
              </button>
              <button type="button" onClick={() => handleRoleSelect('vendor')}
                className={`p-4 rounded-lg border flex flex-col items-center ${selectedRole === 'vendor'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <Truck className="h-6 w-6" />
                <span className="text-sm font-['Lato']">Vendor</span>
              </button>
            </div>
            {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-['Lato']">Email</label>
            <input {...register('email')} type="email" className="border p-2 rounded w-full" placeholder="Enter email" />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-['Lato']">Password</label>
            <div className="relative">
              <input {...register('password')} type={showPassword ? 'text' : 'password'} className="border p-2 rounded w-full pr-10" placeholder="Enter password" />
              <button type="button" className="absolute right-2 top-2" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-700 text-white py-2 rounded mt-2">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
