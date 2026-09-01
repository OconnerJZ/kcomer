import { useCallback, useMemo, useState } from "react";
import {
  buildInitialSelection,
  createCustomizationConfiguration,
  resolveCustomizationSelection,
  toggleChoiceSelection,
  validateCustomizationSelection,
} from "../model/productCustomization";

export const useProductCustomization = ({ item, onConfirm }) => {
  const groups = useMemo(() => item.modifierGroups || [], [item.modifierGroups]);
  const [selected, setSelected] = useState(() => (
    buildInitialSelection(groups, item.modifiers || [])
  ));
  const [note, setNote] = useState(item.note || "");
  const [error, setError] = useState("");
  const preview = useMemo(
    () => resolveCustomizationSelection(groups, selected),
    [groups, selected],
  );
  const finalPrice = Number(item.price || 0) + preview.extra;

  const toggleChoice = useCallback((group, choice) => {
    setError("");
    setSelected((current) => toggleChoiceSelection(current, group, choice));
  }, []);

  const changeNote = useCallback((event) => setNote(event.target.value), []);

  const confirm = useCallback(() => {
    const validationError = validateCustomizationSelection(groups, selected);
    if (validationError) {
      setError(validationError);
      return;
    }

    onConfirm(createCustomizationConfiguration({ item, preview, note }));
  }, [groups, item, note, onConfirm, preview, selected]);

  return {
    groups,
    selected,
    note,
    error,
    finalPrice,
    toggleChoice,
    changeNote,
    confirm,
  };
};

export default useProductCustomization;
