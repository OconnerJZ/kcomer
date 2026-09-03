const normalizeModifierChoice = (choice = {}) => ({
  id: choice.id ?? choice.choiceId ?? choice.choice_id ?? null,
  name: choice.name ?? choice.optionName ?? choice.option_name ?? "",
  priceExtra: Number(choice.priceExtra ?? choice.price_extra ?? 0) || 0,
  defaultSelected: Boolean(
    choice.defaultSelected ?? choice.isDefault ?? choice.is_default ?? false,
  ),
});

const normalizeModifierGroup = (group = {}) => {
  const choices = group.choices || group.options || group.menuOptionChoices || [];
  const minSelect = Number(group.minSelect ?? group.min_select ?? 0) || 0;
  const maxSelect = Number(group.maxSelect ?? group.max_select ?? 0) || 0;

  return {
    id: group.id ?? group.groupId ?? group.group_id ?? null,
    title: group.title ?? group.name ?? "Personalización",
    minSelect,
    maxSelect,
    selectionType:
      group.selectionType ?? group.selection_type ?? (maxSelect === 1 ? "single" : "multiple"),
    required: Boolean(group.required ?? minSelect > 0),
    choices: Array.isArray(choices) ? choices.map(normalizeModifierChoice) : [],
  };
};

const resolveModifierGroups = (item = {}) => {
  const groups = item.modifierGroups || item.modifier_groups || item.optionGroups || [];
  return Array.isArray(groups) ? groups.map(normalizeModifierGroup) : [];
};

export const normalizeMenuItem = (item = {}) => ({
  ...item,
  id: item.id,
  businessId: item.businessId ?? item.business_id ?? null,
  name: item.name ?? item.item_name ?? "",
  description: item.description ?? "",
  price: Number(item.price) || 0,
  category: item.category ?? "",
  image: item.image ?? item.image_url ?? "",
  available: item.available ?? item.is_available ?? true,
  modifierGroups: resolveModifierGroups(item),
});

export const normalizeMenuItems = (items = []) =>
  Array.isArray(items) ? items.map(normalizeMenuItem) : [];

export const toMenuPayload = (item = {}, businessId) => ({
  business_id: businessId ?? item.businessId ?? item.business_id,
  item_name: item.name ?? item.item_name ?? "",
  description: item.description ?? "",
  price: Number.parseFloat(item.price) || 0,
  category: item.category ?? "",
  image_url: item.image ?? item.image_url ?? "",
  is_available: item.available ?? item.is_available ?? true,
});
