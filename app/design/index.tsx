import { ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '@/src/components/layout/Container';
import { Column } from '@/src/components/layout/Column';
import { Row } from '@/src/components/layout/Row';
import { Text } from '@/src/components/ui/Text';
import { ArrowRightIcon } from 'react-native-heroicons/outline';

export default function DesignSystemIndex() {
  const router = useRouter();

  const categories = [
    { name: 'Buttons', route: '/design/buttons', desc: 'All button variants and states' },
    { name: 'Inputs', route: '/design/inputs', desc: 'Text fields, forms, and errors' },
    { name: 'Typography', route: '/design/typography', desc: 'Headings, body, and muted text' },
    { name: 'Layouts', route: '/design/layouts', desc: 'Containers, rows, and columns' },
  ];

  return (
    <Container className="bg-background" safeArea>
      <ScrollView className="flex-1 px-6 pt-4">

        <Column className="mb-8">
          <Text variant="h1" className="mb-2">Cashevide UI</Text>
          <Text variant="body" className="text-muted-foreground">
            A minimalist black and white design system.
          </Text>
        </Column>

        <Column className="space-y-4">
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              className="bg-card p-5 rounded-xl border border-border"
              onPress={() => router.push(cat.route as any)}
            >
              <Row justify="between" items="center">
                <Column>
                  <Text variant="h3" className="mb-1">{cat.name}</Text>
                  <Text variant="caption">{cat.desc}</Text>
                </Column>
                <ArrowRightIcon color="var(--color-muted-foreground)" size={20} />
              </Row>
            </TouchableOpacity>
          ))}
        </Column>

      </ScrollView>
    </Container>
  );
}
