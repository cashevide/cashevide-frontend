import { useState } from "react";
import { ScrollView, View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import {
  Text,
  Button,
  Modal,
  ConfirmDialog,
  InfoDialog,
} from "@/src/shared/ui";

const LOREM_PARAGRAPHS = Array.from({ length: 8 }, (_, i) => i);

export default function DesignModal() {
  const [basicVisible, setBasicVisible] = useState(false);
  const [nonDismissibleVisible, setNonDismissibleVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [destructiveConfirmVisible, setDestructiveConfirmVisible] =
    useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [stickyFooterVisible, setStickyFooterVisible] = useState(false);
  const [scrollableVisible, setScrollableVisible] = useState(false);

  function handleDestructiveConfirm() {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setDestructiveConfirmVisible(false);
    }, 1500);
  }

  return (
    <Container variant="desktop" safeArea scroll>
      <View className="py-12 px-6 gap-10">
        <Text variant="title">Modal</Text>

        <View className="flex-row flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            title="Basic"
            onPress={() => setBasicVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Non-dismissible"
            onPress={() => setNonDismissibleVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="With Footer"
            onPress={() => setFooterVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Scrollable Content"
            onPress={() => setScrollableVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Sticky Footer"
            onPress={() => setStickyFooterVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Confirm Dialog"
            onPress={() => setConfirmVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Destructive Confirm"
            onPress={() => setDestructiveConfirmVisible(true)}
          />
          <Button
            variant="outline"
            size="sm"
            title="Info Dialog"
            onPress={() => setInfoVisible(true)}
          />
        </View>
      </View>

      <Modal
        visible={basicVisible}
        onDismiss={() => setBasicVisible(false)}
        title="Basic Modal"
        description="Tap the backdrop or the back button to dismiss."
      />

      <Modal
        visible={nonDismissibleVisible}
        dismissible={false}
        title="Non-dismissible Modal"
        description="Can only be closed using the button below."
        footer={
          <Button
            variant="primary"
            size="sm"
            title="Close"
            onPress={() => setNonDismissibleVisible(false)}
          />
        }
      />

      <Modal
        visible={footerVisible}
        onDismiss={() => setFooterVisible(false)}
        title="Confirm Deletion"
        description="This action cannot be undone. Are you sure you want to continue?"
        footer={
          <View className="flex-row justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              title="Cancel"
              onPress={() => setFooterVisible(false)}
            />
            <Button
              variant="destructive"
              size="sm"
              title="Delete"
              onPress={() => setFooterVisible(false)}
            />
          </View>
        }
      />

      <Modal
        visible={scrollableVisible}
        onDismiss={() => setScrollableVisible(false)}
        title="Terms and Conditions"
        description="Please review the full text below."
      >
        <ScrollView className="max-h-[280px]">
          <View className="gap-3">
            {LOREM_PARAGRAPHS.map((i) => (
              <Text key={i} variant="body-sm">
                Section {i + 1}. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </Text>
            ))}
          </View>
        </ScrollView>
      </Modal>

      <Modal
        visible={stickyFooterVisible}
        onDismiss={() => setStickyFooterVisible(false)}
        title="Updated Terms & Privacy Policy"
        description="We have updated our legal documents. Please review and accept to continue."
        footer={
          <View className="flex-row justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              title="Decline"
              onPress={() => setStickyFooterVisible(false)}
            />
            <Button
              variant="primary"
              size="sm"
              title="Accept & Continue"
              onPress={() => setStickyFooterVisible(false)}
            />
          </View>
        }
      >
        <ScrollView className="max-h-[220px]">
          <View className="gap-3">
            {LOREM_PARAGRAPHS.map((i) => (
              <Text key={i} variant="body-sm">
                Section {i + 1}. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </Text>
            ))}
          </View>
        </ScrollView>
      </Modal>

      <ConfirmDialog
        visible={confirmVisible}
        title="Log out?"
        message="You will need to sign in again to access your account."
        confirmLabel="Log out"
        onConfirm={() => setConfirmVisible(false)}
        onCancel={() => setConfirmVisible(false)}
      />

      <ConfirmDialog
        visible={destructiveConfirmVisible}
        title="Delete client"
        message="This will permanently remove this client and cannot be undone."
        confirmLabel="Delete"
        destructive
        isConfirming={isConfirming}
        onConfirm={handleDestructiveConfirm}
        onCancel={() => setDestructiveConfirmVisible(false)}
      />

      <InfoDialog
        visible={infoVisible}
        title="Upgrade required"
        message="You've reached the free plan limit for clients. Upgrade to add more."
        onDismiss={() => setInfoVisible(false)}
      />
    </Container>
  );
}
