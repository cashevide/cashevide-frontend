import { ScrollView } from 'react-native';
import { Container } from '@/src/components/layout/Container';
import { Column } from '@/src/components/layout/Column';
import { Text } from '@/src/components/ui/Text';

export default function TypographyGallery() {
  return (
    <Container variant='desktop' className="bg-background" safeArea={false}>
      <ScrollView className="flex-1 px-6 pt-4 pb-10">

        <Column className="mb-8">
          <Text variant="h2" className="mb-2">Typography</Text>
          <Text variant="body" className="text-muted-foreground">
            Text styles and variants used across the app.
          </Text>
        </Column>

        <Column className="space-y-6">

          {/* --- Headings --- */}
          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: h1</Text>
            <Text variant="h1">Heading 1</Text>
          </Column>

          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: h2</Text>
            <Text variant="h2">Heading 2</Text>
          </Column>

          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: h3</Text>
            <Text variant="h3">Heading 3</Text>
          </Column>

          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: h4</Text>
            <Text variant="h4">Heading 4</Text>
          </Column>

          {/* --- Body Text --- */}
          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: large</Text>
            <Text variant="large">Large body text. Great for subheadings.</Text>
          </Column>

          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: body</Text>
            <Text variant="body">This is the default body text. It's used for standard paragraphs and general content.</Text>
          </Column>

          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: small</Text>
            <Text variant="small">Small body text for secondary information.</Text>
          </Column>

          {/* --- Muted & Micro-copy --- */}
          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: muted</Text>
            <Text variant="muted">Muted text that doesn't need much attention.</Text>
          </Column>

          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: caption</Text>
            <Text variant="caption">Caption text for hints or footnotes.</Text>
          </Column>

          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: overline</Text>
            <Text variant="overline">Overline text</Text>
          </Column>

          {/* --- Interactive Elements --- */}
          <Column className="space-y-2 border-b border-border pb-4">
            <Text variant="caption" className="text-muted-foreground">Variant: link</Text>
            <Text variant="link">Clickable Link Style</Text>
          </Column>

          <Column className="space-y-2 pb-10">
            <Text variant="caption" className="text-muted-foreground">Variant: button</Text>
            <Text variant="button">Button Text Style</Text>
          </Column>

        </Column>

      </ScrollView>
    </Container>
  );
}
