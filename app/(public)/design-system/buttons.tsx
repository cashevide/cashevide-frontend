import { View } from "react-native";
import {
  ArrowRightIcon,
  TrashIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";

import { Container } from "@/src/shared/layout/Container";
import { Text, Button, GoogleButton } from "@/src/shared/ui";

const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "brand",
  "success",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const;

export default function DesignButtons() {
  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-14">
        <Text variant="title">Buttons</Text>

        {/* Variants x states */}
        <View className="gap-6">
          <Text variant="heading">Variants</Text>

          <View className="gap-1">
            {BUTTON_VARIANTS.map((variant) => (
              <View
                key={variant}
                className="flex-col gap-3 md:flex-row md:items-center md:gap-8 border-b border-border py-5"
              >
                <Text
                  variant="caption"
                  className="md:w-24 md:shrink-0 text-muted-foreground"
                >
                  {variant}
                </Text>

                <View className="flex-row flex-wrap items-center gap-3">
                  <Button variant={variant} title="Button" />
                  <Button variant={variant} title="Loading" isLoading />
                  <Button variant={variant} title="Disabled" disabled />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Icons */}
        <View className="gap-6">
          <Text variant="heading">With Icons</Text>

          <View className="flex-row flex-wrap items-center gap-4 border-b border-border py-5">
            <Button
              variant="primary"
              title="Continue"
              rightIcon={<ArrowRightIcon size={18} />}
            />
            <Button
              variant="destructive"
              title="Delete"
              leftIcon={<TrashIcon size={18} />}
            />
            <Button
              variant="outline"
              title="Next"
              rightIcon={<ArrowRightIcon size={18} />}
            />
          </View>
        </View>

        {/* Sizes */}
        <View className="gap-6">
          <Text variant="heading">Sizes</Text>

          <View className="flex-row flex-wrap items-center gap-4 border-b border-border py-5">
            <Button variant="primary" size="sm" title="Small" />
            <Button variant="primary" size="default" title="Default" />
            <Button variant="primary" size="lg" title="Large" />
          </View>
        </View>

        {/* Icon-only */}
        <View className="gap-6">
          <Text variant="heading">Icon Only</Text>

          <View className="gap-1">
            {BUTTON_VARIANTS.map((variant) => (
              <View
                key={variant}
                className="flex-col gap-3 md:flex-row md:items-center md:gap-8 border-b border-border py-5"
              >
                <Text
                  variant="caption"
                  className="md:w-24 md:shrink-0 text-muted-foreground"
                >
                  {variant}
                </Text>

                <View className="flex-row flex-wrap items-center gap-3">
                  <Button
                    size="icon"
                    variant={variant}
                    icon={<XMarkIcon size={20} />}
                    accessibilityLabel="Close"
                  />
                  <Button
                    size="icon"
                    variant={variant}
                    icon={<XMarkIcon size={20} />}
                    accessibilityLabel="Close"
                    isLoading
                  />
                  <Button
                    size="icon"
                    variant={variant}
                    icon={<XMarkIcon size={20} />}
                    accessibilityLabel="Close"
                    disabled
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Google Button */}
        <View className="gap-6">
          <Text variant="heading">Google Button</Text>

          <View className="gap-3 max-w-[400px] py-5">
            <GoogleButton />
            <GoogleButton isLoading />
            <GoogleButton disabled />
          </View>
        </View>

        {/* Full width */}
        <View className="gap-6">
          <Text variant="heading">Full Width</Text>

          <View className="gap-3 py-5">
            <Button variant="primary" title="Continue with Email" fullWidth />
            <GoogleButton />
          </View>
        </View>
      </View>
    </Container>
  );
}
