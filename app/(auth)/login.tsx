import { useState } from 'react';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useRouter } from 'expo-router';

import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Container } from '../../src/components/ui/Container';

import { Column } from '../../src/components/layout/Column';
import { Center } from '../../src/components/layout/Center';

export default function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <Column className="flex-1 w-full bg-background">
      <Container variant="default" className="flex-1 justify-center">

        <Center className="w-full md:w-1/2 mx-auto bg-card px-5">

          <Text variant="h1" className="mb-8">Cashevide Login</Text>

          <Input
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
            className="mb-2"
          />

          {error && <Text className="text-red-500 mb-4">{error}</Text>}

          <Button
            title="Login"
            onPress={handleLogin}
            isLoading={isLoading}
            className="mb-4"
          />

          <Button
            title="Don't have an account? Signup here"
            variant="ghost"
            onPress={() => router.push('/(auth)/signup')}
          />

        </Center>
      </Container>
    </Column>
  );
}
