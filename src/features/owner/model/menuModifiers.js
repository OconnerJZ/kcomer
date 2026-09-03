export const createModifierChoice = (overrides = {}) => ({
  name: "",
  priceExtra: 0,
  defaultSelected: false,
  ...overrides,
});

export const createModifierGroup = (overrides = {}) => ({
  title: "",
  minSelect: 0,
  maxSelect: 0,
  choices: [createModifierChoice()],
  ...overrides,
});

export const MODIFIER_TEMPLATES = Object.freeze([
  { key: "ingredients", label: "Ingredientes", helper: "Incluidos y removibles" },
  { key: "extras", label: "Extras", helper: "Opciones con costo" },
  { key: "single", label: "Elegir uno", helper: "Una opción requerida" },
]);

export const createGroupFromTemplate = (templateKey) => {
  if (templateKey === "ingredients") {
    return createModifierGroup({
      title: "Ingredientes",
      choices: [
        createModifierChoice({ name: "Cebolla", defaultSelected: true }),
        createModifierChoice({ name: "Jitomate", defaultSelected: true }),
        createModifierChoice({ name: "Lechuga", defaultSelected: true }),
      ],
    });
  }
  if (templateKey === "extras") {
    return createModifierGroup({
      title: "Extras",
      maxSelect: 3,
      choices: [
        createModifierChoice({ name: "Extra queso", priceExtra: 20 }),
        createModifierChoice({ name: "Extra tocino", priceExtra: 25 }),
      ],
    });
  }
  if (templateKey === "single") {
    return createModifierGroup({
      title: "Elige una opción",
      minSelect: 1,
      maxSelect: 1,
      choices: [
        createModifierChoice({ name: "Opción 1", defaultSelected: true }),
        createModifierChoice({ name: "Opción 2" }),
      ],
    });
  }
  return createModifierGroup();
};

export const normalizeModifierGroups = (response) => {
  const groups = response?.data || response || [];
  return Array.isArray(groups) ? groups.map((group) => ({
    id: group.id,
    title: group.title || "",
    minSelect: Number(group.minSelect || 0),
    maxSelect: Number(group.maxSelect || 0),
    choices: (group.choices || []).map((choice) => ({
      id: choice.id,
      name: choice.name || "",
      priceExtra: Number(choice.priceExtra || 0),
      defaultSelected: Boolean(choice.defaultSelected),
    })),
  })) : [];
};

export const updateModifierGroup = (groups, groupIndex, field, value) =>
  groups.map((group, index) => {
    if (index !== groupIndex) return group;
    const next = { ...group, [field]: value };
    if (field === "maxSelect" && Number(value) === 1) {
      const firstDefault = next.choices.findIndex((choice) => choice.defaultSelected);
      next.choices = next.choices.map((choice, choiceIndex) => ({
        ...choice,
        defaultSelected: firstDefault === -1 ? choiceIndex === 0 : choiceIndex === firstDefault,
      }));
      if (Number(next.minSelect || 0) > 1) next.minSelect = 1;
    }
    return next;
  });

export const updateModifierChoice = (groups, groupIndex, choiceIndex, field, value) =>
  groups.map((group, index) => index === groupIndex ? ({
    ...group,
    choices: group.choices.map((choice, currentChoiceIndex) =>
      currentChoiceIndex === choiceIndex ? { ...choice, [field]: value } : choice),
  }) : group);

export const addModifierChoice = (groups, groupIndex) =>
  groups.map((group, index) => index === groupIndex
    ? { ...group, choices: [...group.choices, createModifierChoice()] }
    : group);

export const removeModifierChoice = (groups, groupIndex, choiceIndex) =>
  groups.map((group, index) => index === groupIndex
    ? { ...group, choices: group.choices.filter((_, currentIndex) => currentIndex !== choiceIndex) }
    : group);

export const removeModifierGroup = (groups, groupIndex) =>
  groups.filter((_, index) => index !== groupIndex);

export const setDefaultModifierChoice = (groups, groupIndex, choiceIndex, checked) =>
  groups.map((group, index) => {
    if (index !== groupIndex) return group;
    const single = Number(group.maxSelect || 0) === 1;
    return {
      ...group,
      choices: group.choices.map((choice, currentChoiceIndex) => ({
        ...choice,
        defaultSelected: currentChoiceIndex === choiceIndex
          ? checked
          : single && checked ? false : choice.defaultSelected,
      })),
    };
  });

export const validateModifierGroups = (groups = []) => {
  for (const group of groups) {
    if (!group.title.trim()) return "Cada grupo necesita un nombre";
    if (!group.choices.length) return `${group.title}: agrega al menos una opción`;
    if (group.choices.some((choice) => !choice.name.trim())) return `${group.title}: hay opciones sin nombre`;

    const min = Number(group.minSelect || 0);
    const max = Number(group.maxSelect || 0);
    const defaults = group.choices.filter((choice) => choice.defaultSelected).length;
    if (min > group.choices.length) return `${group.title}: el mínimo supera el número de opciones`;
    if (max > 0 && min > max) return `${group.title}: el mínimo no puede superar al máximo`;
    if (max > 0 && max > group.choices.length) return `${group.title}: el máximo supera el número de opciones`;
    if (max > 0 && defaults > max) return `${group.title}: hay más opciones incluidas que el máximo permitido`;
    if (max === 1 && defaults > 1) return `${group.title}: solo una opción puede venir seleccionada`;
  }
  return "";
};

export const modifierGroupsChanged = (groups, baseline) =>
  JSON.stringify(groups) !== JSON.stringify(baseline);
