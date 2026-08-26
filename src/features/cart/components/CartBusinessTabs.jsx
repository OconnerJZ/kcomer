import { Chip, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";

export default function CartBusinessTabs({
  businesses,
  cart,
  activeTab,
  onChange,
}) {
  if (!businesses.length) return null;

  return (
    <Paper sx={{ mb: 2, borderRadius: 0 }} elevation={0}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {businesses.map((businessId) => (
          <Tab
            key={businessId}
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>{cart[businessId].businessName}</Typography>
                <Chip
                  label={Object.keys(cart[businessId].items).length}
                  size="small"
                  color="warning"
                />
              </Stack>
            }
          />
        ))}
      </Tabs>
    </Paper>
  );
}
