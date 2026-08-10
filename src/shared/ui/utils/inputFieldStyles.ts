import { cn } from "@/src/shared/utils/cn";

export type InputFieldState = "default" | "focused" | "error" | "success";

interface InputFieldClassesOptions {
  state: InputFieldState;
  disabled?: boolean;
  className?: string;
}

const BORDER_CLASS: Record<InputFieldState, string> = {
  default: "border-border",
  focused: "border-ring",
  error: "border-destructive",
  success: "border-success",
};

// react-native-web adds the browser's native focus outline (often a
// stark white/blue ring) on top of our own border styling. Spread this
// into a text field's `style` prop to suppress it so only the
// border-* token above is visible on focus. className can't express
// `outline` (it isn't a real RN style prop, only recognized on web), so
// this has to be a style object, not a Tailwind class.
export const inputFieldWebResetStyle = { outlineStyle: "none" } as any;

// Shared base styling for any text-entry field (Input, OtpInput,
// PhoneNumberInput, ...). Change radius/bg/border-width/etc. here once
// and every field atom/molecule built on top of it stays in sync.
export function getInputFieldClasses({
  state,
  disabled = false,
  className = "",
}: InputFieldClassesOptions) {
  return cn(
    "h-12 px-4 bg-card text-foreground rounded-lg border placeholder:text-muted-foreground",
    BORDER_CLASS[state],
    disabled && "opacity-50",
    className,
  );
}
