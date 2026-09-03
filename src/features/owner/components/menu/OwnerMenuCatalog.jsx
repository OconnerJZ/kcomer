import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Fade,
  Grid,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import MenuItemActions from "./MenuItemActions";
import MenuModifierSummary from "./MenuModifierSummary";

const menuItemShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.number.isRequired,
  category: PropTypes.string,
  image: PropTypes.string,
  available: PropTypes.bool.isRequired,
  modifierGroups: PropTypes.arrayOf(PropTypes.object),
});

const AvailabilityControl = ({ item, onToggle }) => (
  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
    <Switch
      checked={item.available}
      onChange={() => onToggle(item.id)}
      size="small"
      inputProps={{ "aria-label": `${item.available ? "pausar" : "activar"} ${item.name}` }}
    />
    <Typography variant="caption" color={item.available ? "success.main" : "text.secondary"}>
      {item.available ? "Disponible" : "Pausado"}
    </Typography>
  </Stack>
);

AvailabilityControl.propTypes = {
  item: menuItemShape.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const DesktopMenuTable = ({ items, onCustomize, onEdit, onDelete, onToggle }) => (
  <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px", overflow: "hidden" }}>
    <Table>
      <TableHead>
        <TableRow sx={{ bgcolor: "rgba(0,0,0,.025)" }}>
          <TableCell>Platillo</TableCell>
          <TableCell>Categoría</TableCell>
          <TableCell align="right">Precio</TableCell>
          <TableCell align="center">Estado</TableCell>
          <TableCell align="right">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id} hover sx={{ "& td": { borderColor: "divider" } }}>
            <TableCell>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={item.image} variant="rounded" sx={{ width: 54, height: 54, borderRadius: "8px" }}><ImageIcon /></Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                  {item.description && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: 420 }}>
                      {item.description}
                    </Typography>
                  )}
                  <MenuModifierSummary item={item} />
                </Box>
              </Stack>
            </TableCell>
            <TableCell>{item.category && <Chip label={item.category} size="small" variant="outlined" sx={{ borderRadius: "15px" }} />}</TableCell>
            <TableCell align="right"><Typography fontWeight={600}>${item.price.toFixed(2)}</Typography></TableCell>
            <TableCell align="center"><AvailabilityControl item={item} onToggle={onToggle} /></TableCell>
            <TableCell align="right"><MenuItemActions item={item} onCustomize={onCustomize} onEdit={onEdit} onDelete={onDelete} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const MobileMenuGrid = ({ items, onCustomize, onEdit, onDelete, onToggle }) => (
  <Grid container spacing={1.5}>
    {items.map((item) => (
      <Grid item xs={12} sm={6} key={item.id}>
        <Fade in>
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px", height: "100%", bgcolor: "rgba(255,255,255,.82)", overflow: "hidden" }}>
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5}>
                  <Avatar src={item.image} variant="rounded" sx={{ width: 72, height: 72, borderRadius: "8px" }}><ImageIcon /></Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap>{item.name}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>${item.price.toFixed(2)}</Typography>
                    {item.category && <Typography variant="caption" color="text.secondary">{item.category}</Typography>}
                    <MenuModifierSummary item={item} compact />
                  </Box>
                </Stack>
                {item.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.description}
                  </Typography>
                )}
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={1}>
                  <Box sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}><AvailabilityControl item={item} onToggle={onToggle} /></Box>
                  <Box sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}><MenuItemActions item={item} onCustomize={onCustomize} onEdit={onEdit} onDelete={onDelete} /></Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Fade>
      </Grid>
    ))}
  </Grid>
);

const catalogPropTypes = {
  items: PropTypes.arrayOf(menuItemShape).isRequired,
  onCustomize: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

DesktopMenuTable.propTypes = catalogPropTypes;
MobileMenuGrid.propTypes = catalogPropTypes;

const OwnerMenuCatalog = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return isMobile ? <MobileMenuGrid {...props} /> : <DesktopMenuTable {...props} />;
};

OwnerMenuCatalog.propTypes = catalogPropTypes;

export default OwnerMenuCatalog;
