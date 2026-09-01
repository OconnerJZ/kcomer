import PropTypes from "prop-types";
import { Image as ImageIcon, TuneRounded } from "@mui/icons-material";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import useMenuItemSelection from "../hooks/useMenuItemSelection";
import MenuItemModifierSummary from "./MenuItemModifierSummary";
import MenuItemSelectionControls from "./MenuItemSelectionControls";
import ProductCustomizationDialog from "./ProductCustomizationDialog";

const CARD_STYLES = {
  width: "100%",
  mb: 1,
  overflow: "hidden",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2.5,
  bgcolor: "rgba(255,255,255,.82)",
  transition: "transform .16s ease, box-shadow .16s ease, border-color .16s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 28px rgba(0,0,0,.06)",
    borderColor: "rgba(255, 75, 69, .28)",
  },
};

const CardMenuList = ({
  item,
  businessId,
  businessName,
  paymentMethods = [],
  onAddToCart,
  initialQuantity = 0,
  initialConfiguration = null,
  busy = false,
  targetLabel = "",
}) => {
  const selection = useMenuItemSelection({
    item,
    businessId,
    businessName,
    paymentMethods,
    onAddToCart,
    initialQuantity,
    initialConfiguration,
  });

  return (
    <>
      <Card elevation={0} sx={CARD_STYLES}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "88px minmax(0, 1fr)", sm: "104px minmax(0, 1fr)" } }}>
          <Box
            sx={{
              minHeight: { xs: 104, sm: 112 },
              bgcolor: "rgba(255,159,28,.08)",
              backgroundImage: selection.menuItem.image ? `url(${selection.menuItem.image})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "grid",
              placeItems: "center",
            }}
          >
            {!selection.menuItem.image && <ImageIcon sx={{ color: "grey.300", fontSize: 34 }} />}
          </Box>

          <CardContent sx={{ p: { xs: 1.25, sm: 1.75 }, "&:last-child": { pb: { xs: 1.25, sm: 1.75 } } }}>
            <Stack spacing={1.15}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
                  <Box minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.25 }}>
                      {selection.menuItem.name}
                    </Typography>
                    {selection.configurable && (
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.35 }}>
                        <TuneRounded sx={{ fontSize: 14, color: "primary.main" }} />
                        <Typography variant="caption" color="primary.main" fontWeight={750}>
                          Personalizable
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={800} color="primary.main" sx={{ whiteSpace: "nowrap" }}>
                    ${selection.displayPrice.toFixed(2)}
                  </Typography>
                </Stack>
                {selection.menuItem.description && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", mt: 0.4, lineHeight: 1.45 }}
                  >
                    {selection.menuItem.description}
                  </Typography>
                )}
                {selection.includedIngredients.length > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.45, lineHeight: 1.35 }}>
                    Incluye: {selection.includedIngredients.slice(0, 4).map((choice) => choice.name).join(" · ")}
                    {selection.includedIngredients.length > 4 ? "…" : ""}
                  </Typography>
                )}
              </Box>

              {selection.quantity > 0
                && (selection.removed.length > 0 || selection.selectedExtras.length > 0) && (
                  <MenuItemModifierSummary
                    removed={selection.removed}
                    selectedExtras={selection.selectedExtras}
                  />
              )}

              <MenuItemSelectionControls
                quantity={selection.quantity}
                configurable={selection.configurable}
                busy={busy}
                targetLabel={targetLabel}
                onIncrement={selection.increment}
                onDecrement={selection.decrement}
                onEdit={selection.openCustomizer}
              />
            </Stack>
          </CardContent>
        </Box>
      </Card>

      <ProductCustomizationDialog
        open={selection.customizerOpen}
        item={selection.customizationItem}
        onClose={selection.closeCustomizer}
        onConfirm={selection.confirmConfiguration}
      />
    </>
  );
};

CardMenuList.propTypes = {
  item: PropTypes.object.isRequired,
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  businessName: PropTypes.string,
  paymentMethods: PropTypes.array,
  onAddToCart: PropTypes.func.isRequired,
  initialQuantity: PropTypes.number,
  initialConfiguration: PropTypes.object,
  busy: PropTypes.bool,
  targetLabel: PropTypes.string,
};

export default CardMenuList;
