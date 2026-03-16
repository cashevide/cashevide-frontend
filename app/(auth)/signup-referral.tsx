// app/(auth)/signup-referral.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignupStore } from '../../src/store/useSignupStore';

import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Container } from '../../src/components/layout/Container';

export default function SignupReferralScreen() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState(''); // Error message
  const setSignupData = useSignupStore((state) => state.setSignupData);

  const handleNext = () => {
    if (referralCode.trim().length === 0) {
      setError("Please enter a valid referral code");
      return;
    }

    setError('');

    setSignupData({ referral_code_input: referralCode });

    router.push('/(auth)/signup-email');
  };

  return (
    <Container variant="default" className="flex-1 bg-background px-6 justify-center">
      <Text variant="h2" className="mb-2 text-heading">Have a Referral Code?</Text>

      <Text variant="body" className="text-body mb-8">
        Cashevide is currently invite-only. Please enter the code below.
      </Text>

      <Input
        placeholder="Enter Referral Code"
        value={referralCode}
        onChangeText={(text) => {
          setReferralCode(text);
          if (error) setError('');
        }}
        autoCapitalize="characters"
        error={error}
      />

      <View className="mt-4">
        <Button
          title="Continue"
          variant="primary"
          onPress={handleNext}
        />
      </View>
    </Container>
  );
}
