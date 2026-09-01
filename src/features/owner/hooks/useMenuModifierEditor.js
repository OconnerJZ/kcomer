import { useCallback, useMemo, useState } from "react";
import {
  useGetMenuModifiersQuery,
  useUpdateMenuModifiersMutation,
} from "@Features/menu/api/menu.api";
import { useFeedback } from "@Shared/feedback/FeedbackProvider";
import {
  addModifierChoice,
  createGroupFromTemplate,
  createModifierGroup,
  modifierGroupsChanged,
  normalizeModifierGroups,
  removeModifierChoice,
  removeModifierGroup,
  setDefaultModifierChoice,
  updateModifierChoice,
  updateModifierGroup,
  validateModifierGroups,
} from "../model/menuModifiers";

export const useMenuModifierEditor = (menuId) => {
  const feedback = useFeedback();
  const { data, isLoading, isFetching } = useGetMenuModifiersQuery(menuId, { skip: !menuId });
  const [saveModifiers, { isLoading: saving }] = useUpdateMenuModifiersMutation();
  const [draft, setDraft] = useState(null);
  const serverGroups = useMemo(() => normalizeModifierGroups(data), [data]);
  const currentDraft = draft?.menuId === menuId ? draft : null;
  const groups = currentDraft?.groups ?? serverGroups;
  const baseline = currentDraft?.baseline ?? serverGroups;

  const editGroups = useCallback((recipe) => {
    setDraft((current) => {
      const activeDraft = current?.menuId === menuId
        ? current
        : { menuId, groups: serverGroups, baseline: serverGroups };
      return { ...activeDraft, groups: recipe(activeDraft.groups) };
    });
  }, [menuId, serverGroups]);

  const addEmptyGroup = useCallback(() => {
    editGroups((current) => [...current, createModifierGroup()]);
  }, [editGroups]);

  const addTemplate = useCallback((templateKey) => {
    editGroups((current) => [...current, createGroupFromTemplate(templateKey)]);
  }, [editGroups]);

  const updateGroup = useCallback((groupIndex, field, value) => {
    editGroups((current) => updateModifierGroup(current, groupIndex, field, value));
  }, [editGroups]);

  const updateChoice = useCallback((groupIndex, choiceIndex, field, value) => {
    editGroups((current) => updateModifierChoice(
      current,
      groupIndex,
      choiceIndex,
      field,
      value,
    ));
  }, [editGroups]);

  const addChoice = useCallback((groupIndex) => {
    editGroups((current) => addModifierChoice(current, groupIndex));
  }, [editGroups]);

  const removeChoice = useCallback((groupIndex, choiceIndex) => {
    editGroups((current) => removeModifierChoice(current, groupIndex, choiceIndex));
  }, [editGroups]);

  const removeGroup = useCallback((groupIndex) => {
    editGroups((current) => removeModifierGroup(current, groupIndex));
  }, [editGroups]);

  const setDefaultChoice = useCallback((groupIndex, choiceIndex, checked) => {
    editGroups((current) => setDefaultModifierChoice(
      current,
      groupIndex,
      choiceIndex,
      checked,
    ));
  }, [editGroups]);

  const save = useCallback(async () => {
    const validationError = validateModifierGroups(groups);
    if (validationError) {
      feedback.warning(validationError);
      return false;
    }

    try {
      const response = await saveModifiers({ menuId, groups }).unwrap();
      const savedGroups = normalizeModifierGroups(response);
      setDraft({ menuId, groups: savedGroups, baseline: savedGroups });
      feedback.success("Personalización actualizada");
      return true;
    } catch (error) {
      feedback.error(
        error?.data?.message || error?.message || "No se pudo guardar la personalización",
      );
      return false;
    }
  }, [feedback, groups, menuId, saveModifiers]);

  return {
    groups,
    loading: isLoading || isFetching,
    saving,
    hasChanges: modifierGroupsChanged(groups, baseline),
    addEmptyGroup,
    addTemplate,
    updateGroup,
    updateChoice,
    addChoice,
    removeChoice,
    removeGroup,
    setDefaultChoice,
    save,
  };
};

export default useMenuModifierEditor;
