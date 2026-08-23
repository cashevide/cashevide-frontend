import { PropsWithChildren, ReactNode } from "react";
import { Modal as RNModal, Pressable, ScrollView, View } from "react-native";

import { cn } from "@/src/shared/utils/cn";
import { Text } from "../atoms/Text";

type ModalProps = PropsWithChildren<{
  visible: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  title?: string;
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
}>;

export function Modal({
  visible,
  dismissible = true,
  onDismiss,
  title,
  description,
  footer,
  className = "",
  children,
}: ModalProps) {
  function handleRequestClose() {
    if (dismissible) {
      onDismiss?.();
    }
  }

  const hasHeader = title || description;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleRequestClose}
    >
      <Pressable
        onPress={handleRequestClose}
        className="flex-1 items-center justify-center bg-overlay/50 px-4"
      >
        {/* Content card — wrapped in its own Pressable with an empty
            onPress so taps here stop propagating to the backdrop
            Pressable above. Without this, tapping anywhere inside the
            modal (a button, an input, the card background) would also
            trigger the backdrop's dismiss handler, since RN Pressables
            without stopPropagation let the press bubble up. */}
        <Pressable
          onPress={() => {}}
          className={cn(
            "w-full max-w-[450px] max-h-[80%] gap-6 rounded-lg bg-secondary border border-border p-6 shadow-lg",
            className,
          )}
        >
          <ScrollView
            className="shrink"
            contentContainerClassName="gap-2"
            showsVerticalScrollIndicator={true}
          >
            {hasHeader ? (
              <View className="gap-2">
                {title ? <Text variant="subheading">{title}</Text> : null}
                {description ? (
                  typeof description === "string" ? (
                    <Text variant="body-sm">{description}</Text>
                  ) : (
                    description
                  )
                ) : null}
              </View>
            ) : null}

            {children}
          </ScrollView>

          {footer ? <View>{footer}</View> : null}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
