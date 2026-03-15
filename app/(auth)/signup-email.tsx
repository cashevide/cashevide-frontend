// app/(auth)/signup-email.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignupStore } from '../../src/store/useSignupStore';
import { requestSignupOtp } from '../../src/api/auth';

import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Container } from '../../src/components/ui/Container';

export default function SignupEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // API call നടക്കുമ്പോൾ loading കാണിക്കാൻ

  const setSignupData = useSignupStore((state) => state.setSignupData);

  const isValidEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleSendCode = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email address is required");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await requestSignupOtp(trimmedEmail);

      setSignupData({ email: trimmedEmail });

      router.push('/(auth)/signup-otp');

    } catch (err: any) {
      setError(err?.response?.data?.email?.[0] || err?.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container variant="default" className="flex-1 px-6 justify-center bg-background">
      <Text variant="h2" className="mb-2 text-heading">What's your email?</Text>

      <Text variant="body" className="text-body mb-8">
        We'll send a 6-digit verification code to this email to verify your account.
      </Text>

      <Input
        placeholder="e.g. name@example.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={error}
      />

      <View className="mt-4">
        <Button
          title="Send Code"
          variant="primary"
          onPress={handleSendCode}
          isLoading={isLoading}
        />
      </View>
    </Container>
  );
}
