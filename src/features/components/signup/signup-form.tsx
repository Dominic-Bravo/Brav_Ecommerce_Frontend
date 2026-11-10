"use client";

import React, { useState } from 'react';
import { useRegister } from '@/features/auth/hooks/use-register';
import { RoleEnum } from '@/api/generated/models/roleEnum';
import { RegisterRequest } from '@/api/generated/models/authentication/registerRequest';

export function RegisterForm() {
  const { mutate: registerUser, isPending, error } = useRegister();

  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: RoleEnum.customer,
    password: '',
    password_confirm: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' && name === 'phone' ? null : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass data payload wrapped in `data:` as expected by Orval / React Query mutations
    registerUser({ data: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      
      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-700 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p role="alert" className="font-medium leading-relaxed">
            {error?.response?.data?.message || 'An error occurred during registration.'}
          </p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          maxLength={254}
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>

      {/* First Name & Last Name Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            maxLength={100}
            required
            placeholder="John"
            className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            maxLength={100}
            required
            placeholder="Doe"
            className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
          />
        </div>
      </div>

      {/* Phone Number Field */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          Phone Number <span className="text-brav-muted font-normal lowercase">(optional)</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone ?? ''}
          onChange={handleChange}
          maxLength={20}
          placeholder="+1234567890"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
          required
          placeholder="At least 8 characters"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-brav-charcoal/80">
          Confirm Password
        </label>
        <input
          type="password"
          name="password_confirm"
          value={formData.password_confirm}
          onChange={handleChange}
          required
          placeholder="Repeat your password"
          className="w-full rounded-xl border border-brav-border bg-brav-surface px-4 py-3 text-sm text-brav-charcoal placeholder:text-brav-muted focus:border-brav-gold focus:bg-brav-white focus:outline-none focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center rounded-xl bg-brav-charcoal px-4 py-3 text-sm font-semibold text-brav-white shadow-md shadow-brav-charcoal/10 hover:bg-brav-dark focus:outline-none focus:ring-4 focus:ring-brav-gold/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 pt-3"
      >
        {isPending ? (
          <span className="flex items-center space-x-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-brav-gold border-t-transparent" />
            <span>Creating Account...</span>
          </span>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}