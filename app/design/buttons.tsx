import { ScrollView, View } from 'react-native';
import { Container } from '@/src/components/layout/Container';
import { Column } from '@/src/components/layout/Column';
import { Row } from '@/src/components/layout/Row';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { GoogleButton } from '@/src/components/ui/GoogleButton';
import { ArrowRightIcon, PlusIcon } from 'react-native-heroicons/outline';

export default function ButtonsGallery() {
  return (
    <Container variant='full'>

      <Container variant='desktop' className="bg-background">
        <ScrollView className="flex-1 px-6 pt-4 pb-10">

          <Column className="mb-8">
            <Text variant="h2" className="mb-2">Buttons</Text>
            <Text variant="body" className="text-muted-foreground">
              Various button styles and states used in Cashevide.
            </Text>
          </Column>

          <Column className="space-y-8">

            {/* Variants */}
            <Column className="space-y-4">
              <Text variant="h3">Variants</Text>
              <View className="flex-wrap flex-row gap-4">
                <Button title="Default" variant="brand" />
                <Button title="Primary" variant="primary" />
                <Button title="Secondary" variant="secondary" />
                <Button title="Destructive" variant="destructive" />
                <Button title="Outline" variant="outline" />
                <Button title="Ghost" variant="ghost" />
              </View>
            </Column>

            {/* Full Width */}
            <Column className="space-y-4">
              <Text variant="h3">Full Width</Text>
              <Button title="Full Width Button" variant="primary" fullWidth />
            </Column>

            {/* With Icons */}
            <Column className="space-y-4">
              <Text variant="h3">With Icons</Text>
              <Row className="gap-4">
                <Button
                  title="Add Client"
                  variant="brand"
                  leftIcon={<PlusIcon size={20} />}
                />
                <Button
                  title="Next"
                  variant="outline"
                  rightIcon={<ArrowRightIcon size={20} />}
                />
              </Row>
            </Column>

            {/* States */}
            <Column className="space-y-4">
              <Text variant="h3">States</Text>
              <Row className="gap-4">
                <Button title="Loading..." variant="primary" isLoading />
                <Button title="Disabled" variant="brand" disabled />
              </Row>
            </Column>

            {/* Social Auth */}
            <Column className="space-y-4 pb-10">
              <Text variant="h3">Social Auth</Text>
              <GoogleButton />
            </Column>

          </Column>

        </ScrollView>
      </Container>
    </Container>
  );
}
