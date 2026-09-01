import { useCallback, useMemo, useState } from "react";
import { useFeedback } from "@Shared/feedback/FeedbackProvider";
import {
  createBusinessRegistrationForm,
  createBusinessRegistrationSteps,
  validateBusinessRegistrationStep,
} from "../model/businessRegistration";

export const useBusinessRegistrationWizard = (foodTypes = []) => {
  const feedback = useFeedback();
  const [currentTab, setCurrentTab] = useState(0);
  const [formValues, setFormValues] = useState(createBusinessRegistrationForm);
  const [errors, setErrors] = useState({});
  const steps = useMemo(() => createBusinessRegistrationSteps(foodTypes), [foodTypes]);
  const currentStep = steps[currentTab];

  const validateCurrentStep = useCallback(() => {
    const nextErrors = validateBusinessRegistrationStep(formValues, currentStep);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [currentStep, formValues]);

  const advance = useCallback(async (onComplete) => {
    if (!validateCurrentStep()) {
      feedback.warning("Revisa los campos marcados antes de continuar.", {
        title: "Falta información",
      });
      return false;
    }

    if (currentTab >= steps.length - 1) {
      await onComplete();
      return true;
    }

    setCurrentTab((current) => current + 1);
    return true;
  }, [currentTab, feedback, steps.length, validateCurrentStep]);

  const goBack = useCallback(() => {
    setCurrentTab((current) => Math.max(0, current - 1));
    setErrors({});
  }, []);

  return {
    currentTab,
    currentStep,
    steps,
    formValues,
    setFormValues,
    errors,
    advance,
    goBack,
  };
};

export default useBusinessRegistrationWizard;
