import { Box, Chip, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import PropTypes from "prop-types";

export default function MenuToolbar({
  search,
  onSearchChange,
  categories = [],
  selectedCategory = "all",
  onCategoryChange,
  total = 0,
  available = 0,
}) {
  return (
    <Stack spacing={1.5} sx={{ mb: 2.5 }}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }} gap={1.5}>
        <TextField
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar platillo"
          size="small"
          sx={{ width: { xs: "100%", md: 320 }, "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "background.paper" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={2} alignItems="center" sx={{ px: { xs: 0.5, md: 0 } }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Disponibles</Typography>
            <Typography variant="subtitle1" fontWeight={600}>{available}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Total</Typography>
            <Typography variant="subtitle1" fontWeight={600}>{total}</Typography>
          </Box>
        </Stack>
      </Stack>

      {categories.length > 0 && (
        <Box sx={{ overflowX: "auto", pb: 0.5 }}>
          <Stack direction="row" spacing={1} sx={{ minWidth: "max-content" }}>
            <Chip
              label="Todos"
              clickable
              onClick={() => onCategoryChange("all")}
              color={selectedCategory === "all" ? "primary" : "default"}
              variant={selectedCategory === "all" ? "filled" : "outlined"}
              sx={{ borderRadius: "6px" }}
            />
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                clickable
                onClick={() => onCategoryChange(category)}
                color={selectedCategory === category ? "primary" : "default"}
                variant={selectedCategory === category ? "filled" : "outlined"}
                sx={{ borderRadius: "6px" }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

MenuToolbar.propTypes = {
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string),
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
  total: PropTypes.number,
  available: PropTypes.number,
};
