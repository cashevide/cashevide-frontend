import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFullName] = useState('');
  const [referralCodeInput, setReferralCode] = useState('')

  const router = useRouter()
  const { signup, isLoading, error } = useAuthStore()

  const handleSignup = async () => {

    if (!email || !username || !password) {
      alert('please fill in all fields!')
      return;
    }

    await signup(email, username, password, full_name, referralCodeInput);

  }

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
        Create Account 🚀
      </Text>

      {error && (
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      )}

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-lg"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />


      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-lg"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-lg"
        placeholder="Full Name"
        value={full_name}
        onChangeText={setFullName}
        autoCapitalize="none"
      />


      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-lg"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-lg"
        placeholder="Referral code"
        value={referralCodeInput}
        onChangeText={setReferralCode}
        autoCapitalize="none"
      />

      {/* Signup Button */}
      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-4 mb-4"
        onPress={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white text-lg font-bold">
            Sign Up
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text className="text-center text-blue-500 text-base">
          Already have an account? Login here
        </Text>
      </TouchableOpacity>
    </View>
  );
}
