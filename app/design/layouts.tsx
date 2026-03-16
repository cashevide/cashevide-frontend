import { ScrollView, View } from 'react-native';
import { Container } from '@/src/components/layout/Container';
import { Column } from '@/src/components/layout/Column';
import { Row } from '@/src/components/layout/Row';
import { Center } from '@/src/components/layout/Center';
import { Text } from '@/src/components/ui/Text';

export default function LayoutsGallery() {
  return (
    <Container className="bg-background" safeArea={false}>
      <ScrollView className="flex-1 px-6 pt-4 pb-10">

        <Column className="mb-8">
          <Text variant="h2" className="mb-2">Layouts</Text>
          <Text variant="body" className="text-muted-foreground">
            Structural components for building UI.
          </Text>
        </Column>

        <Column className="space-y-8">

          {/* Row & Column Example */}
          <Column className="space-y-4">
            <Text variant="h3">Row & Column</Text>
            <Column className="bg-card p-4 rounded-xl border border-border space-y-4">
              <Text variant="caption" className="text-muted-foreground">A column containing a row:</Text>
              <Row justify="between" items="center" className="bg-secondary p-3 rounded-lg">
                <Text variant="body" className="font-semibold">Left Side</Text>
                <Text variant="body" className="font-semibold">Right Side</Text>
              </Row>
            </Column>
          </Column>

          {/* Center Example */}
          <Column className="space-y-4">
            <Text variant="h3">Center</Text>
            <View className="h-32 bg-card border border-border rounded-xl">
              <Center>
                <Text variant="body" className="font-bold">Perfectly Centered</Text>
              </Center>
            </View>
          </Column>

          {/* Narrow Container Description */}
          <Column className="space-y-4 pb-10">
            <Text variant="h3">Narrow Container</Text>
            <Text variant="body" className="text-muted-foreground leading-6">
              The <Text className="font-bold">variant="narrow"</Text> prop in the Container component restricts the max-width to 480px. This is perfect for Auth screens to prevent forms from stretching too wide on tablets or the web.
            </Text>
          </Column>

        </Column>

      </ScrollView>
    </Container>
  );
}
