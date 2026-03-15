// app/(auth)/signup-details.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useSignupStore } from '../../src/store/useSignupStore';
import { useAuthStore } from '../../src/store/useAuthStore'; // 👈 Auth Store ഇംപോർട്ട് ചെയ്തു
import { checkUsernameAvailability } from '../../src/api/auth'; // registerUser ഒഴിവാക്കി

import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Container } from '../../src/components/ui/Container';

export default function SignupDetailsScreen() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { email, referral_code_input, clearSignupData } = useSignupStore();

  // Auth Store-ൽ നിന്ന് signup ഫംഗ്ഷൻ എടുക്കുന്നു
  const { signup } = useAuthStore();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (username.length >= 3) {
        try {
          const isAvailable = await checkUsernameAvailability(username);
          if (!isAvailable) {
            setUsernameError('This username is already taken!');
          } else {
            setUsernameError('');
          }
        } catch (error) {
          console.error("Error checking username", error);
        }
      } else if (username.length > 0) {
        setUsernameError('Username must be at least 3 characters');
      } else {
        setUsernameError('');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const handleFinalSignup = async () => {
    if (!fullName.trim() || !username.trim() || !password) {
      setFormError("All fields are required");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    if (usernameError) {
      return;
    }

    setFormError('');
    setIsLoading(true);

    try {
      // 🚀 Auth Store-ലെ signup ഫംഗ്ഷൻ വിളിക്കുന്നു
      const success = await signup(
        email,
        username.toLowerCase(),
        password,
        fullName,
        referral_code_input
      );

      if (success) {
        // Signup വിജയിച്ചാൽ പഴയ ഡാറ്റ ക്ലിയർ ചെയ്യുക.
        // ഇവിടെ router.replace കൊടുക്കേണ്ടതില്ല, കാരണം _layout.tsx തനിയെ redirect ചെയ്തോളും!
        clearSignupData();
      } else {
        // useAuthStore-ൽ എറർ സെറ്റ് ചെയ്യുന്നുണ്ട്, വേണമെങ്കിൽ അതെടുത്ത് ഇവിടെയും കാണിക്കാം
        // അല്ലെങ്കിൽ ജനറൽ എറർ കാണിക്കാം
        setFormError("Signup failed. Please check your details.");
      }

    } catch (err: any) {
      setFormError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container variant="full" className="flex-1 px-6 justify-center bg-white">
      <Text variant="h2" className="mb-2">Almost there!</Text>
      <Text variant="body" className="text-gray-500 mb-8">
        Set up your Cashevide profile details.
      </Text>

      {formError ? (
        <Text className="text-red-500 mb-4 text-center">{formError}</Text>
      ) : null}

      <Input
        label="Full Name"
        placeholder="e.g. Noufal"
        value={fullName}
        onChangeText={(text) => {
          setFullName(text);
          if (formError) setFormError('');
        }}
        autoCapitalize="words"
      />

      <Input
        label="Username"
        placeholder="e.g. noufal_dev"
        value={username}
        onChangeText={(text) => {
          setUsername(text.replace(/\s+/g, ''));
          if (formError) setFormError('');
        }}
        autoCapitalize="none"
        error={usernameError}
      />

      <Input
        label="Password"
        placeholder="Create a strong password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (formError) setFormError('');
        }}
        isPassword={true}
      />

      <View className="mt-6">
        <Button
          title="Complete Sign Up"
          variant="primary"
          onPress={handleFinalSignup}
          isLoading={isLoading}
          disabled={!!usernameError || isLoading}
        />
      </View>
    </Container>
  );
}
