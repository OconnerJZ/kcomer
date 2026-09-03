import PropTypes from "prop-types";
import { Add } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

const PendingOrderMenuList = ({ menu, hasMenu, loading, onAdd }) => (
  <Box>
    <Typography fontWeight={600}>Agregar productos</Typography>
    <Typography variant="caption" color="text.secondary">
      Se usan los precios y disponibilidad actuales del negocio.
    </Typography>
    <Stack spacing={0.75} sx={{ mt: 1.25 }}>
      {menu.map((menuItem) => (
        <Stack
          key={menuItem.id}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ py: 0.65 }}
        >
          <Box>
            <Typography variant="body2" fontWeight={600}>{menuItem.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              ${Number(menuItem.price || 0).toFixed(2)}
              {menuItem.modifierGroups?.length ? " · Personalizable" : ""}
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<Add />}
            onClick={() => onAdd(menuItem)}
            sx={{ textTransform: "none" }}
          >
            Agregar
          </Button>
        </Stack>
      ))}
      {!loading && hasMenu && menu.length === 0 && (
        <Typography variant="caption" color="text.secondary">
          Ya agregaste todos los productos disponibles.
        </Typography>
      )}
    </Stack>
  </Box>
);

PendingOrderMenuList.propTypes = {
  menu: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMenu: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default PendingOrderMenuList;
