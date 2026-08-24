import {
  ref,
  type Ref,
} from "vue";

export type Appearance =
  | "light"
  | "dark"
  | "system";

const appearance =
  ref<Appearance>("system");

function applyAppearance(
  value: Appearance,
): void {
  const root =
    document.documentElement;

  if (value === "system") {
    root.removeAttribute("data-theme");
    return;
  }

  root.setAttribute(
    "data-theme",
    value,
  );
}

function setAppearance(
  value: Appearance,
): void {
  appearance.value = value;

  localStorage.setItem(
    "loba-appearance",
    value,
  );

  applyAppearance(value);
}

function loadAppearance(): void {
  const saved =
    localStorage.getItem(
      "loba-appearance",
    );

  const value: Appearance =
    saved === "light" ||
    saved === "dark" ||
    saved === "system"
      ? saved
      : "system";

  appearance.value = value;
  applyAppearance(value);
}

export function useAppearance(): {
  appearance: Ref<Appearance>;
  setAppearance: (
    value: Appearance,
  ) => void;
  loadAppearance: () => void;
} {
  return {
    appearance,
    setAppearance,
    loadAppearance,
  };
}