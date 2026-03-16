import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function ProfileHome() {
  const router = useRouter();
  const { logout } = useAuthStore()
  return (
    <View className="flex-1 justify-center items-center bg-slate-50">
      <Text className="text-2xl font-bold text-slate-800 mb-4">👤 Profile Section</Text>

      <TouchableOpacity
        onPress={() => router.push('/(tabs)/profile/settings')}
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Go to Settings ⚙️</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} className="p-4 bg-red-50 rounded-xl flex-row justify-center items-center">
        <Text className="text-red-500 font-bold ml-2">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
