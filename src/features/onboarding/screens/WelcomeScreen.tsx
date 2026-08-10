import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { EnvelopeIcon } from "react-native-heroicons/outline";

import { Container } from "@/src/shared/layout/Container";
import {
  Text,
  Button,
  GoogleButton,
  Divider,
  Logo,
  Spinner,
} from "@/src/shared/ui";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function WelcomeScreen() {
  const [isNavigating, setIsNavigating] = useState(false);

  const { request, promptAsync, isPending } = useGoogleAuth({
    onBeforeNavigate: () => setIsNavigating(true),
  });

  const showLoading = isPending || isNavigating;

  if (showLoading) {
    return (
      <Container variant="narrow" safeArea>
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </Container>
    );
  }

  return (
    <Container variant="narrow" safeArea>
      <View className="flex-1 sm:justify-center px-6 pb-16 sm:pb-0 pt-16 sm:py-0">
        <View className="flex-1 sm:flex-none items-center justify-center sm:justify-start gap-4">
          <Logo width={64} />
          <Text variant="subheading" className="text-center">
            Never work blind again.
          </Text>
        </View>

        <View className="gap-6 sm:mt-10">
          <View className="gap-4">
            <GoogleButton onPress={() => promptAsync()} disabled={!request} />

            <Divider label="or" />

            <Button
              variant="primary"
              title="Continue with Email"
              leftIcon={<EnvelopeIcon size={20} />}
              onPress={() => router.push(ROUTES.signup.referral)}
              fullWidth
            />
          </View>

          <View className="items-center gap-3">
            <View className="items-center gap-1">
              <Text variant="caption" className="text-center">
                By continuing, you agree to Cashevide's
              </Text>
              <View className="flex-row gap-1">
                <Text
                  variant="caption"
                  className="text-link"
                  onPress={() => router.push(ROUTES.legal.terms)}
                >
                  Terms
                </Text>
                <Text variant="caption">and</Text>
                <Text
                  variant="caption"
                  className="text-link"
                  onPress={() => router.push(ROUTES.legal.privacyPolicy)}
                >
                  Privacy Policy
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-1">
              <Text variant="body-sm">Already have an account?</Text>
              <Text
                variant="body"
                className="text-link"
                onPress={() => router.push(ROUTES.login)}
              >
                Log in
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}
