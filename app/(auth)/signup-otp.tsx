// app/(auth)/signup-otp.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignupStore } from '../../src/store/useSignupStore';
import { verifySignupOtp } from '../../src/api/auth';

import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Container } from '../../src/components/ui/Container';

export default function SignupOtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { email, setSignupData } = useSignupStore();

  const handleVerify = async () => {
    const trimmedOtp = otp.trim();

    if (!trimmedOtp || trimmedOtp.length < 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    if (!email) {
      setError("Email not found. Please go back and try again.");
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await verifySignupOtp(email, trimmedOtp);

      setSignupData({ isEmailVerified: true });

      router.push('/(auth)/signup-details');

    } catch (err: any) {
      setError(err?.response?.data?.otp?.[0] || err?.response?.data?.error || "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container variant="full" className="flex-1 px-6 justify-center bg-white">
      <Text variant="h2" className="mb-2">Enter verification code</Text>

      <Text variant="body" className="text-gray-500 mb-8">
        We've sent a 6-digit code to <Text className="font-semibold text-black">{email}</Text>. Please enter it below.
      </Text>

      <Input
        placeholder="Enter 6-digit code"
        value={otp}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, '');
          setOtp(numericValue);
          if (error) setError('');
        }}
        keyboardType="number-pad"
        maxLength={6}
        error={error}
        autoFocus
      />

      <View className="mt-4">
        <Button
          title="Verify & Continue"
          variant="primary"
          onPress={handleVerify}
          isLoading={isLoading}
        />
      </View>
    </Container>
  );
}
