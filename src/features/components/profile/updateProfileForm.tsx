
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promise, z } from "zod";
import { ArrowLeft, Loader2, Save, UserRound } from "lucide-react";

import { useAuthSession } from "@/features/auth/providers/auth-provider";
import { useUserUpdate } from "@/features/auth/hooks/use-update-user";
import { useProfileUpdate } from "@/features/auth/hooks/use-update-user";
import { useRouter } from "next/navigation";

const updateProfileSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone: z.string().nullable(),
    date_of_birth: z.string().nullable(),
    gender: z.string().nullable(),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export function UpdateUserProfile() {
    const router = useRouter();
    const isFormInitialized = useRef(false);
    const { user, isLoadingUser, isAuthenticated } = useAuthSession();

    const userUpdateMutation = useUserUpdate();
    const profileUpdateMutation = useProfileUpdate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            date_of_birth: "",
            gender: "",
        },
    });

    useEffect(() => {
        if (!user || isFormInitialized.current) return;

        reset({
            first_name: user.first_name ?? "",
            last_name: user.last_name ?? "",
            phone: user.phone ?? "",
            date_of_birth: user.date_of_birth ?? "",
            gender: user.gender ?? "",
        });

        isFormInitialized.current = true;
    }, [user, reset]);

    if (isLoadingUser) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#C5A880]" />
                <span className="ml-3 text-sm text-[#6B7280]">
                    Loading profile...
                </span>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-20 text-center">
                <UserRound className="mx-auto mb-4 h-10 w-10 text-[#9CA3AF]" />
                <h2 className="text-xl font-semibold text-[#111827]">
                    Authentication required
                </h2>
                <p className="mt-2 text-sm text-[#6B7280]">
                    Please sign in to update your profile.
                </p>
            </div>
        );
    }

    const onSubmit = async (values: UpdateProfileFormValues) => {
        const userPayload = {
            first_name: values.first_name,
            last_name: values.last_name,
            phone: values.phone,
        };

        const profilePayload = {
            date_of_birth: values.date_of_birth,
            gender: values.gender,
        };

        try {
            await Promise.all([
                userUpdateMutation.mutateAsync({
                data: userPayload,
            }),
                profileUpdateMutation.mutateAsync({
                data: profilePayload,
            })
            ]);
            // 2. Refresh and navigate back EXACTLY ONCE after both succeed
            router.refresh();
            router.push('/profile');


        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const isSubmitting =
        userUpdateMutation.isPending ||
        profileUpdateMutation.isPending;

    const inputClassName =
        "w-full rounded-md border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/15 disabled:cursor-not-allowed disabled:bg-[#F9FAFB]";

    const labelClassName =
        "mb-2 block text-sm font-medium text-[#374151]";

    const errorClassName = "mt-1.5 text-xs text-red-600";

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="mb-8">
                    <Link
                        href="/account/profile"
                        className="mb-6 inline-flex items-center gap-2 text-sm text-[#6B7280] transition-colors hover:text-[#111827]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to profile
                    </Link>

                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
                            Account settings
                        </p>

                        <h1 className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">
                            Edit your profile
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6B7280]">
                            Manage your personal information and keep your
                            account details up to date.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">

                        {/* Form Header */}
                        <div className="border-b border-[#E5E7EB] px-6 py-5 sm:px-8">
                            <h2 className="text-base font-semibold text-[#111827]">
                                Personal information
                            </h2>
                            <p className="mt-1 text-sm text-[#6B7280]">
                                Update the details associated with your account.
                            </p>
                        </div>

                        <div className="space-y-8 px-6 py-7 sm:px-8">

                            {/* Name Fields */}
                            <section>
                                <h3 className="mb-5 text-sm font-semibold text-[#111827]">
                                    Basic details
                                </h3>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="first_name" className={labelClassName}>
                                            First name
                                        </label>
                                        <input
                                            id="first_name"
                                            type="text"
                                            placeholder="Enter first name"
                                            autoComplete="given-name"
                                            className={inputClassName}
                                            {...register("first_name")}
                                        />
                                        {errors.first_name && (
                                            <p className={errorClassName}>
                                                {errors.first_name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="last_name" className={labelClassName}>
                                            Last name
                                        </label>
                                        <input
                                            id="last_name"
                                            type="text"
                                            placeholder="Enter last name"
                                            autoComplete="family-name"
                                            className={inputClassName}
                                            {...register("last_name")}
                                        />
                                        {errors.last_name && (
                                            <p className={errorClassName}>
                                                {errors.last_name.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <div className="border-t border-[#F3F4F6]" />

                            {/* Contact Information */}
                            <section>
                                <h3 className="mb-5 text-sm font-semibold text-[#111827]">
                                    Contact information
                                </h3>

                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="phone" className={labelClassName}>
                                            Phone number
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="Enter phone number"
                                            autoComplete="tel"
                                            className={inputClassName}
                                            {...register("phone")}
                                        />
                                        {errors.phone && (
                                            <p className={errorClassName}>
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className={labelClassName}>
                                            Email address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={user.email ?? ""}
                                            disabled
                                            className={inputClassName}
                                        />
                                        <p className="mt-1.5 text-xs text-[#9CA3AF]">
                                            Email address cannot be changed here.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <div className="border-t border-[#F3F4F6]" />

                            {/* Personal Details */}
                            <section>
                                <h3 className="mb-5 text-sm font-semibold text-[#111827]">
                                    Additional information
                                </h3>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="date_of_birth" className={labelClassName}>
                                            Date of birth
                                        </label>
                                        <input
                                            id="date_of_birth"
                                            type="date"
                                            className={inputClassName}
                                            {...register("date_of_birth")}
                                        />
                                        {errors.date_of_birth && (
                                            <p className={errorClassName}>
                                                {errors.date_of_birth.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="gender" className={labelClassName}>
                                            Gender
                                        </label>
                                        <select
                                            id="gender"
                                            className={inputClassName}
                                            {...register("gender")}
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.gender && (
                                            <p className={errorClassName}>
                                                {errors.gender.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-[#E5E7EB] bg-[#FAFAFA] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                            <p className="text-xs text-[#9CA3AF]">
                                Changes will be saved to your account.
                            </p>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                <Link
                                    href="/account/profile"
                                    className="inline-flex items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={!isDirty || isSubmitting}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#C5A880] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B5966C] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
