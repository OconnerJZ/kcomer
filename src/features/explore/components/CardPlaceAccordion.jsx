import { useState } from "react";
import { Box, ButtonBase, Collapse, Stack, Typography } from "@mui/material";
import { Diversity3, EmailRounded, PhoneRounded } from "@mui/icons-material";
import useCardPlaceAccordion from "@Features/explore/hooks/useCardPlaceAccordion";

const ICONS = {
  "Redes Sociales": Diversity3,
  "Teléfono": PhoneRounded,
  "Correo electrónico": EmailRounded,
};

const CardPlaceAccordion = ({ data: datacard }) => {
  const { data } = useCardPlaceAccordion({ datacard });
  const [active, setActive] = useState(null);
  const current = data.find((item) => item.label === active);

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={0.8}>
        {data.map((item) => {
          const Icon = ICONS[item.label] || Diversity3;
          const selected = active === item.label;
          return (
            <ButtonBase
              key={item.label}
              onClick={() => setActive((value) => value === item.label ? null : item.label)}
              sx={{
                flex: 1,
                minWidth: 0,
                px: 1,
                py: 0.9,
                borderRadius: "8px",
                bgcolor: selected ? "rgba(198,90,80,.09)" : "rgba(255,255,255,.58)",
                border: "1px solid",
                borderColor: selected ? "rgba(198,90,80,.18)" : "rgba(0,0,0,.05)",
                transition: "all .18s ease",
                "&:hover": { bgcolor: selected ? "rgba(198,90,80,.12)" : "rgba(255,255,255,.9)" },
              }}
            >
              <Stack direction="row" spacing={0.65} alignItems="center" minWidth={0}>
                <Icon sx={{ fontSize: 16, color: selected ? "primary.main" : "text.secondary" }} />
                <Typography variant="caption" noWrap fontWeight={600} color={selected ? "text.primary" : "text.secondary"}>
                  {item.label === "Correo electrónico" ? "Correo" : item.label === "Redes Sociales" ? "Redes" : item.label}
                </Typography>
              </Stack>
            </ButtonBase>
          );
        })}
      </Stack>

      <Collapse in={Boolean(current)} unmountOnExit>
        <Box sx={{ mt: 1, p: 1.2, borderRadius: "8px", bgcolor: "rgba(255,255,255,.72)", border: "1px solid rgba(0,0,0,.05)" }}>
          {current?.details}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CardPlaceAccordion;
