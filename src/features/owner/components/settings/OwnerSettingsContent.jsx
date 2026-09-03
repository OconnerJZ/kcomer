import PropTypes from "prop-types";
import { Box } from "@mui/material";
import BusinessPlanTab from "@Features/plans/components/BusinessPlanTab";
import {
  BasicInfoTab,
  DeliveryTab,
  FoodTypesTab,
  PaymentMethodsTab,
  SchedulesTab,
} from "./SettingsTabs";
import GalleryTab from "./GalleryTab";
import LocationSettingsTab from "./LocationSettingsTab";
import SocialLinksTab from "./SocialLinksTab";
import TeamAccessTab from "./TeamAccessTab";

const OwnerSettingsContent = ({ activeTab, canManageTeam, businessId, settings, actions }) => {
  const tabs = [
    <BasicInfoTab
      key="basic"
      basicInfo={settings.basicInfo}
      setBasicInfo={settings.setBasicInfo}
      logoFile={actions.logoFile}
      logoPreview={actions.logoPreview}
      onLogoChange={actions.changeLogo}
      onSave={actions.saveBasicInfo}
      loading={settings.loading}
    />,
    <LocationSettingsTab
      key="location"
      locationInfo={settings.locationInfo}
      setLocationInfo={settings.setLocationInfo}
      onSave={actions.saveLocation}
      loading={settings.loading}
    />,
    <SchedulesTab
      key="schedules"
      schedules={settings.schedules}
      setSchedules={settings.setSchedules}
      onSave={actions.saveSchedules}
      loading={settings.loading}
    />,
    <DeliveryTab
      key="delivery"
      deliverySettings={settings.deliverySettings}
      setDeliverySettings={settings.setDeliverySettings}
      onSave={actions.saveDelivery}
      loading={settings.loading}
    />,
    <PaymentMethodsTab
      key="payments"
      paymentMethods={settings.paymentMethods}
      onToggle={actions.togglePayment}
      onConfigChange={actions.updatePaymentConfig}
      onSave={actions.savePayments}
      loading={settings.loading}
    />,
    <FoodTypesTab
      key="food-types"
      availableFoodTypes={settings.availableFoodTypes}
      selectedFoodTypes={settings.selectedFoodTypes}
      loadingCatalogs={settings.loadingCatalogs}
      onToggle={actions.toggleFoodType}
      onSave={actions.saveFoodTypes}
      loading={settings.loading}
    />,
    <SocialLinksTab
      key="social"
      socialInfo={settings.socialInfo}
      setSocialInfo={settings.setSocialInfo}
      onSave={actions.saveSocial}
      loading={settings.loading}
    />,
    <GalleryTab
      key="gallery"
      photos={settings.photos}
      coverImage={settings.coverImage}
      onSetCover={actions.setCoverPhoto}
      onUpload={actions.uploadGalleryPhoto}
      onDelete={actions.removeGalleryPhoto}
      loading={settings.loading}
    />,
    <BusinessPlanTab key="plan" businessId={businessId} />,
    ...(canManageTeam ? [<TeamAccessTab key="team" businessId={businessId} />] : []),
  ];

  return <Box>{tabs[activeTab]}</Box>;
};

OwnerSettingsContent.propTypes = {
  activeTab: PropTypes.number.isRequired,
  canManageTeam: PropTypes.bool.isRequired,
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  settings: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default OwnerSettingsContent;
