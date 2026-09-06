import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/src/shared/ui";
import { Modal } from "@/src/shared/ui/molecules/Modal";
import { useMalayaliModeStore } from "@/src/store/malayaliModeStore";
import { useOnboardingPromptStore } from "@/src/store/onboardingPromptStore";

// The prompt walks through a small set of fixed steps. "dhamu-question" is
// always first. From there the flow branches:
//   - answering "No" (doesn't know Dhamu/Vasu) goes straight to
//     "closing-not-malayali" and mode stays OFF, no mode question asked.
//   - answering "Yes" goes to "mode-question", and whichever answer is
//     given there leads to "closing-journey" with mode set accordingly.
type PromptStep =
  | "dhamu-question"
  | "mode-question"
  | "closing-journey"
  | "closing-not-malayali";

type MalayaliModePromptProps = {
  visible: boolean;
  onComplete: () => void;
};

export function MalayaliModePrompt({
  visible,
  onComplete,
}: MalayaliModePromptProps) {
  const [step, setStep] = useState<PromptStep>("dhamu-question");
  const setMalayaliMode = useMalayaliModeStore(
    (state) => state.setMalayaliMode,
  );
  const setHasSeenMalayaliPrompt = useOnboardingPromptStore(
    (state) => state.setHasSeenMalayaliPrompt,
  );

  function finish() {
    // Marking the prompt as seen happens once, right before the whole
    // flow closes, regardless of which branch the user took. The step is
    // intentionally not reset here — this component unmounts once
    // `onComplete` flips `visible` to false on the parent, so there is no
    // stale state to worry about on a future mount (a fresh mount only
    // happens on next app run, which starts a fresh instance).
    setHasSeenMalayaliPrompt(true);
    onComplete();
  }

  function handleKnowsDhamu(knows: boolean) {
    if (knows) {
      setStep("mode-question");
    } else {
      setStep("closing-not-malayali");
    }
  }

  function handleModeAnswer(wantsMode: boolean) {
    setMalayaliMode(wantsMode);
    setStep("closing-journey");
  }

  if (step === "dhamu-question") {
    return (
      <Modal
        visible={visible}
        dismissible={false}
        title="Do you hear about Dashamoolam Dhamu or Vasu Annan before?"
        footer={
          <View className="flex-row justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              title="No"
              onPress={() => handleKnowsDhamu(false)}
            />
            <Button
              variant="primary"
              size="sm"
              title="Yes"
              onPress={() => handleKnowsDhamu(true)}
            />
          </View>
        }
      />
    );
  }

  if (step === "mode-question") {
    return (
      <Modal
        visible={visible}
        dismissible={false}
        title="കുട്ടാ നീ മലയാളി ആണല്ലേ. മലയാളി മോഡ് ഉണ്ട്. ഓൺ ആക്കണോ?"
        footer={
          <View className="flex-row justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              title="No"
              onPress={() => handleModeAnswer(false)}
            />
            <Button
              variant="primary"
              size="sm"
              title="Yes"
              onPress={() => handleModeAnswer(true)}
            />
          </View>
        }
      />
    );
  }

  if (step === "closing-not-malayali") {
    return (
      <Modal
        visible={visible}
        dismissible={false}
        title="No problem, it was a simple test to know you and the developer from same place. Start your journey."
        footer={
          <View className="flex-row justify-end">
            <Button
              variant="primary"
              size="sm"
              title="Start your journey"
              onPress={finish}
            />
          </View>
        }
      />
    );
  }

  // step === "closing-journey"
  return (
    <Modal
      visible={visible}
      dismissible={false}
      title="Start your journey"
      footer={
        <View className="flex-row justify-end">
          <Button
            variant="primary"
            size="sm"
            title="Start your journey"
            onPress={finish}
          />
        </View>
      }
    />
  );
}
