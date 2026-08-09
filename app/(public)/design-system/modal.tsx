import { useState } from "react";
import { View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import {
  Text,
  Button,
  Modal,
  ConfirmDialog,
  InfoDialog,
} from "@/src/shared/ui";

export default function DesignModal() {
  const [basicVisible, setBasicVisible] = useState(false);
  const [nonDismissibleVisible, setNonDismissibleVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [destructiveConfirmVisible, setDestructiveConfirmVisible] =
    useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

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
