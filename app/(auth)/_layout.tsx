// app/(auth)/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useSignupStore } from '../../src/store/useSignupStore';

export default function AuthLayout() {
  const segments = useSegments();
  const router = useRouter();

  const { referral_code_input, email, isEmailVerified } = useSignupStore();

  useEffect(() => {
    const currentRoute = segments[1];

    if (currentRoute === 'signup-email' && !referral_code_input) {
      router.replace('/(auth)/welcome');
    }
    else if (currentRoute === 'signup-otp' && !email) {
      router.replace('/(auth)/welcome');
    }
    else if (currentRoute === 'signup-details' && !isEmailVerified) {
      router.replace('/(auth)/welcome');
    }

  }, [segments, referral_code_input, email, isEmailVerified]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
