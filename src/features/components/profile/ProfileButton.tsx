'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthSession } from '@/features/auth/providers/auth-provider';
import { useV1UsersMeProfileRetrieve } from '@/api/generated/endpoints/profiles/profiles';

export function ProfileButton() {
  const { user, isAuthenticated } = useAuthSession();

  // Fetch profile to get custom avatar URL if authenticated
  const { data: profileData } = useV1UsersMeProfileRetrieve({
    query: {
      enabled: isAuthenticated && !!user,
      retry: false,
    },
  });

  const avatarUrl = profileData?.avatar;

  // Compute name or initial fallback for authenticated users
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ');
  const userInitial = fullName
    ? fullName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? 'U';

  return (
    <Link
      href={isAuthenticated ? '/profile' : '/login'}
      aria-label={isAuthenticated ? 'User Profile' : 'Sign In'}
      className="relative p-2 text-brav-charcoal hover:text-brav-gold transition-colors inline-flex items-center justify-center"
    >
      {isAuthenticated && avatarUrl && avatarUrl.trim() !== '' ? (
        <div className="relative w-5 h-5 overflow-hidden rounded-full">
          <Image
            src={avatarUrl}
            alt="User Profile"
            fill
            sizes="20px"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : isAuthenticated ? (
        <div className="w-5 h-5 rounded-full bg-brav-gold text-brav-white text-[10px] font-semibold flex items-center justify-center">
          {userInitial}
        </div>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      )}
    </Link>
  );
}