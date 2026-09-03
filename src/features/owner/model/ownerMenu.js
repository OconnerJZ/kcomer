export const createEmptyMenuForm = () => ({
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  available: true,
});

export const toMenuEditorForm = (item) => item ? ({
  name: item.name || "",
  description: item.description || "",
  price: item.price ?? "",
  category: item.category || "",
  image: item.image || "",
  available: item.available !== false,
}) : createEmptyMenuForm();

export const getModifierSummary = (item = {}) => {
  const groups = Array.isArray(item.modifierGroups) ? item.modifierGroups : [];
  const options = groups.reduce(
    (total, group) => total + (Array.isArray(group.choices) ? group.choices.length : 0),
    0,
  );
  return { groups: groups.length, options };
};

export const getMenuCategories = (menu = []) =>
  [...new Set(menu.map((item) => item.category).filter(Boolean))].sort();

export const filterOwnerMenu = (menu = [], search = "", category = "all") => {
  const term = search.trim().toLowerCase();
  return menu.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const matchesSearch = !term || [item.name, item.description, item.category]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });
};

export const getAvailableMenuCount = (menu = []) =>
  menu.filter((item) => item.available).length;

export const canSaveMenuForm = (form = {}) =>
  Boolean(form.name?.trim()) && Number(form.price) > 0;
