'use client';

import { useAuthSession } from '@/features/auth/providers/auth-provider';
import { RoleGuard } from '@/features/auth/providers/role-guard';
import { useV1UsersMeProfileRetrieve } from '@/api/generated/endpoints/profiles/profiles';
import Image from 'next/image';
import { AddressList } from '../addresses/AddressList';
import { LogoutButton } from "@/features/components/profile/logout";
import { UpdateProfileButton } from "@/features/components/profile/UpdateProfileButton";
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function ProfilePage() {
  const { user, isLoadingUser, isAuthenticated } = useAuthSession();

  // Fetch the authenticated user's additional profile information.
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError: isProfileError,
  } = useV1UsersMeProfileRetrieve({
    query: {
      enabled: isAuthenticated && !!user,
      retry: false,
    },
  });

  const isLoading = isLoadingUser || isLoadingProfile;
  const profile = profileData;

  const fullName = [
    user?.first_name,
    user?.last_name,
  ]
    .filter(Boolean)
    .join(' ');

  const userInitial = fullName
    ? fullName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? 'U';

  const formatDate = (value?: string | null) => {
    if (!value) return 'Not provided';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return 'Not provided';

    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 font-sans selection:bg-brav-gold/20">
        <div className="max-w-sm text-center space-y-3 bg-brav-white p-8 rounded-2xl border border-brav-border shadow-xl">
          <h2 className="font-display text-2xl font-medium text-brav-charcoal tracking-tight">
            Authentication Required
          </h2>
          <p className="font-sans text-xs sm:text-sm text-brav-muted leading-relaxed">
            Please log in to access your profile and account settings.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-sans">
        <div className="flex items-center gap-3 bg-brav-surface px-6 py-4 rounded-xl border border-brav-border shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brav-gold border-t-transparent" />
          <p className="text-sm font-medium text-brav-charcoal">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['customer', 'admin']}>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14 font-sans selection:bg-brav-gold/20">

        {/* Page Heading & Header Actions */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brav-border pb-6">
          <div className="space-y-1">
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-brav-gold">
              Brav Account
            </span>

            <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-brav-charcoal">
              My Profile
            </h1>

            <p className="font-sans font-normal text-sm text-brav-muted">
              Manage your personal information and account details.
            </p>
          </div>

          {/* Top Level Action Bar */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <UpdateProfileButton size="sm" />
            <LogoutButton size="sm" variant="danger" />
          </div>
        </div>

        {/* Profile Banner / Avatar Card */}
        <section className="border-b border-brav-border pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              
              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brav-surface border-2 border-brav-border text-2xl font-display font-medium text-brav-gold shadow-sm">
                {profile?.avatar && profile.avatar.trim() !== "" ? (
                  <Image
                    src={profile.avatar}
                    alt="Profile avatar"
                    width={80}  
                    height={80}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  userInitial
                )}
              </div>

              {/* User Information */}
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="font-display text-2xl font-medium text-brav-charcoal tracking-tight">
                  {fullName || 'Your Profile'}
                </h2>

                <p className="truncate text-sm font-sans text-brav-muted">
                  {user?.email}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brav-surface border border-brav-border px-3 py-1 text-xs font-sans font-semibold capitalize text-brav-charcoal">
                    {user?.role}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-sans font-semibold border ${
                      user?.is_active
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {user?.is_active ? 'Active Account' : 'Inactive Account'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Information */}
        <section className="border-b border-brav-border py-8">
          <div className="mb-6 space-y-1">
            <h2 className="font-display text-xl font-medium text-brav-charcoal tracking-tight">
              Account Information
            </h2>

            <p className="font-sans font-normal text-xs sm:text-sm text-brav-muted">
              Your registered account and contact details.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            <ProfileField label="First Name" value={user?.first_name} />
            <ProfileField label="Last Name" value={user?.last_name} />
            <ProfileField label="Email Address" value={user?.email} />
            <ProfileField label="Phone Number" value={user?.phone} />
            <ProfileField label="Account Type" value={user?.role} />
            <ProfileField
              label="Account Status"
              value={user?.is_active ? 'Active' : 'Inactive'}
            />
          </div>
        </section>

        {/* Personal Information */}
        <section className="border-b border-brav-border py-8">
          <div className="mb-6 space-y-1">
            <h2 className="font-display text-xl font-medium text-brav-charcoal tracking-tight">
              Personal Information
            </h2>

            <p className="font-sans font-normal text-xs sm:text-sm text-brav-muted">
              Additional information associated with your profile.
            </p>
          </div>

          {isProfileError ? (
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 text-xs text-red-700 font-sans">
              Unable to load your personal information.
            </div>
          ) : (
            <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              <ProfileField
                label="Date of Birth"
                value={formatDate(profile?.date_of_birth)}
              />

              <ProfileField
                label="Gender"
                value={profile?.gender}
              />

              <ProfileField
                label="Profile Created"
                value={formatDate(profile?.created_at)}
              />

              <ProfileField
                label="Last Updated"
                value={formatDate(profile?.updated_at)}
              />
            </div>
          )}
        </section>

        {/* Account Metadata */}
        <section className="py-8 border-b border-brav-border">
          <div className="mb-6 space-y-1">
            <h2 className="font-display text-xl font-medium text-brav-charcoal tracking-tight">
              Account Details
            </h2>
          </div>

          <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            <ProfileField
              label="User ID"
              value={user?.id}
            />

            <ProfileField
              label="Member Since"
              value={formatDate(user?.created_at)}
            />
          </div>
        </section>

        {/* Admin Information */}
        {user?.role === 'admin' && (
          <section className="py-8 border-b border-brav-border">
            <div className="p-6 rounded-2xl bg-brav-surface border border-brav-gold/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-display text-lg font-medium text-brav-charcoal tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brav-gold" />
                  Administrative Account
                </h2>

                <p className="font-sans font-normal text-xs sm:text-sm text-brav-muted leading-relaxed">
                  Your account has administrative access to manage the Brav catalog and store management suite.
                </p>
              </div>

              <Link
                href="/products/admin"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brav-charcoal hover:bg-brav-dark text-brav-white font-sans text-xs font-semibold rounded-xl shadow-xs transition-all duration-200 shrink-0 active:scale-95 border border-brav-border/40"
              >
                <span>Manage Products</span>
                <ArrowRight className="w-3.5 h-3.5 text-brav-gold" />
              </Link>
            </div>
          </section>
        )}
        {/* Addresses Section */}
        <div className="pt-6">
          <AddressList />
        </div>

      </main>
    </RoleGuard>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-[11px] font-sans font-semibold uppercase tracking-wider text-brav-muted">
        {label}
      </p>

      <p className="wrap-break-word text-sm font-sans font-semibold text-brav-charcoal">
        {value || 'Not provided'}
      </p>
    </div>
  );
}