import { useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useGetFoodTypesQuery } from "@Features/catalogs/api/catalogs.api";
import { normalizeCatalogOptions } from "@Features/catalogs/model/catalogOption";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import BusinessRegistrationSuccess from "../components/registration/BusinessRegistrationSuccess";
import BusinessRegistrationWizard from "../components/registration/BusinessRegistrationWizard";
import { useBusinessRegistrationWizard } from "../hooks/useBusinessRegistrationWizard";
import { useCreateBusinessRegistration } from "../hooks/useCreateBusinessRegistration";
import "antd/dist/reset.css";

const RegisterBusiness = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { data: foodTypesResponse, isLoading: loadingFoodTypes } = useGetFoodTypesQuery();
  const foodTypes = useMemo(
    () => normalizeCatalogOptions(foodTypesResponse?.data || foodTypesResponse || []),
    [foodTypesResponse],
  );
  const wizard = useBusinessRegistrationWizard(foodTypes);
  const registration = useCreateBusinessRegistration({
    formValues: wizard.formValues,
    onSuccess,
  });

  return (
    <GeneralContent>
      {registration.submitted ? (
        <BusinessRegistrationSuccess
          ownerReady={registration.ownerReady}
          onContinue={() => navigate(registration.ownerReady ? "/owner" : "/explorar")}
        />
      ) : (
        <BusinessRegistrationWizard
          currentTab={wizard.currentTab}
          steps={wizard.steps}
          step={wizard.currentStep}
          formValues={wizard.formValues}
          setFormValues={wizard.setFormValues}
          errors={wizard.errors}
          loading={registration.loading}
          loadingFoodTypes={loadingFoodTypes}
          onBack={wizard.goBack}
          onNext={() => wizard.advance(registration.submit)}
        />
      )}
    </GeneralContent>
  );
};

RegisterBusiness.propTypes = {
  onSuccess: PropTypes.func,
};

export default RegisterBusiness;
