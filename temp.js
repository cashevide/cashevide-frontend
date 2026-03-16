
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-2xl mb-4 items-center shadow-sm"
          onPress={() => { /* Google Logic */ }}
        >
          <Text className="text-white font-semibold text-lg">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 p-4 rounded-2xl mb-6 items-center shadow-sm"
          onPress={() => router.push('/(auth)/signup-referral')}
        >
          <Text className="text-white font-semibold text-lg">Continue with Email</Text>
        </TouchableOpacity>

        <View className="justify-center items-center mt-4">
          <Text className="text-gray-600">Already have an account? </Text>
          <Button
            title="Login"
            variant="ghost"
            className="mt-4"
            onPress={() => router.push('/(auth)/login')}
          />
        </View>
