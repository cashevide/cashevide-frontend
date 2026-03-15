import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter()

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <View className='flex-1 w-full #bg-primary'>
      <View className='flex-1 w-full max-w-[1200px] bg-heading mx-auto justify-center'>
        <View className="flex-1 w-full md:w-1/2 mx-auto items-center justify-center bg-white px-5">
          <Text className="text-3xl font-bold mb-8 text-primary">Cashivide Login</Text>

          {/* Email Input */}
          <TextInput
            className="w-full bg-gray-100 p-4 rounded-lg mb-4 border border-gray-200"
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Password Input */}
          <TextInput
            className="w-full bg-gray-100 p-4 rounded-lg mb-6 border border-gray-200"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Error Message */}
          {error && <Text className="text-red-500 mb-4">{error}</Text>}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 p-4 rounded-lg items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-center text-blue-500 text-base">
              Don't have an account? Signup here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
