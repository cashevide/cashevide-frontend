import { useRouter } from "expo-router"

import { Button } from '@/src/components/ui/Button';
import { Container } from '@/src/components/layout/Container';
import { Row } from "@/src/components/layout/Row";
import { Column } from "@/src/components/layout/Column";
import { Text } from "@/src/components/ui/Text";
import { TouchableOpacity } from "react-native";

import { ArrowRightIcon, PlusCircleIcon } from 'react-native-heroicons/outline';
import { GoogleButton } from "@/src/components/ui/GoogleButton";
import { Input } from "@/src/components/ui/Input";

export default function WelcomeScreen() {

  const router = useRouter();

  return (
    <Container safeArea>
      <Container variant="desktop" className="justify-center items-center">
        <Button
          title="🎨 View Design System"
          variant="primary"
          onPress={() => router.push('/design')}
        />
      </Container>
    </Container>
  )
}


