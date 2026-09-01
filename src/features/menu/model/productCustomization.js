export const isSingleSelection = (group) => (
  group.selectionType === "single" || Number(group.maxSelect || 0) === 1
);

export const buildInitialSelection = (groups = [], modifiers = []) => {
  const selected = new Map();
  groups.forEach((group) => {
    (group.choices || []).forEach((choice) => {
      if (choice.defaultSelected) selected.set(Number(choice.id), true);
    });
  });

  modifiers.forEach((modifier) => {
    const choiceId = Number(modifier.choiceId);
    if (modifier.state === "removed") selected.delete(choiceId);
    else selected.set(choiceId, true);
  });
  return selected;
};

export const toggleChoiceSelection = (current, group, choice) => {
  const next = new Map(current);
  const choiceId = Number(choice.id);

  if (isSingleSelection(group)) {
    (group.choices || []).forEach((candidate) => next.delete(Number(candidate.id)));
    next.set(choiceId, true);
    return next;
  }

  if (next.get(choiceId)) next.delete(choiceId);
  else next.set(choiceId, true);
  return next;
};

export const resolveCustomizationSelection = (groups, selected) => {
  const modifiers = [];
  const summary = [];
  let extra = 0;

  groups.forEach((group) => {
    (group.choices || []).forEach((choice) => {
      const choiceId = Number(choice.id);
      const selectedChoice = Boolean(selected.get(choiceId));
      const defaultChoice = Boolean(choice.defaultSelected);

      if (selectedChoice) {
        modifiers.push({ choiceId, state: "selected" });
        extra += Number(choice.priceExtra || 0);
        summary.push({
          group: group.title,
          name: choice.name,
          state: "selected",
          priceExtra: Number(choice.priceExtra || 0),
        });
      } else if (defaultChoice) {
        modifiers.push({ choiceId, state: "removed" });
        summary.push({
          group: group.title,
          name: choice.name,
          state: "removed",
          priceExtra: 0,
        });
      }
    });
  });

  return { modifiers, summary, extra: Number(extra.toFixed(2)) };
};

export const validateCustomizationSelection = (groups, selected) => {
  for (const group of groups) {
    const count = (group.choices || [])
      .filter((choice) => selected.get(Number(choice.id)))
      .length;
    const minimum = Number(group.minSelect || 0);
    const configuredMaximum = Number(group.maxSelect || 0);
    const maximum = configuredMaximum > 0
      ? configuredMaximum
      : Number.POSITIVE_INFINITY;

    if (count < minimum) return `${group.title}: selecciona al menos ${minimum}`;
    if (count > maximum) return `${group.title}: selecciona máximo ${maximum}`;
  }
  return "";
};

export const createCustomizationConfiguration = ({ item, preview, note }) => ({
  modifiers: preview.modifiers,
  modifierSummary: preview.summary,
  note: note.trim(),
  price: Number(item.price || 0) + preview.extra,
  basePrice: Number(item.price || 0),
});
