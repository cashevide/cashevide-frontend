import { ScrollView } from 'react-native';
import { Container } from '@/src/components/layout/Container';
import { Column } from '@/src/components/layout/Column';
import { Text } from '@/src/components/ui/Text';
import { Input } from '@/src/components/ui/Input';

export default function InputsGallery() {
  return (
    <Container variant='desktop' className="bg-background" safeArea={false}>
      <ScrollView className="flex-1 px-6 pt-4 pb-10">

        <Column className="mb-8">
          <Text variant="h2" className="mb-2">Inputs & Forms</Text>
          <Text variant="body" className="text-muted-foreground">
            Text fields and form controls.
          </Text>
        </Column>

        <Column className="space-y-6">

          <Column>
            <Text variant="h3" className="mb-4">Basic Input</Text>
            <Input
              placeholder="Enter your email address"
            />
          </Column>

          <Column>
            <Text variant="h3" className="mb-4">With Label</Text>
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
            />
          </Column>

          <Column>
            <Text variant="h3" className="mb-4">Password Input</Text>
            <Input
              label="Password"
              placeholder="Enter your password"
              isPassword
            />
          </Column>

          <Column>
            <Text variant="h3" className="mb-4">Error State</Text>
            <Input
              label="Username"
              placeholder="Choose a username"
              value="admin"
              error="This username is already taken. Please try another."
            />
          </Column>

          <Column pb-10>
            <Text variant="h3" className="mb-4">Success State</Text>
            <Input
              label="Username"
              placeholder="Choose a username"
              value="noufal_designer"
              isSuccess={true}
            />
          </Column>

        </Column>

      </ScrollView>
    </Container>
  );
}
