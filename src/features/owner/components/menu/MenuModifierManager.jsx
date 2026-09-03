import PropTypes from "prop-types";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Add, TuneRounded } from "@mui/icons-material";
import { useMenuModifierEditor } from "../../hooks/useMenuModifierEditor";
import MenuModifierGroups from "./MenuModifierGroups";
import MenuModifierTemplates from "./MenuModifierTemplates";

export default function MenuModifierManager({ menuId }) {
  const editor = useMenuModifierEditor(menuId);

  if (!menuId) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Divider sx={{ mb: 2.5 }} />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <TuneRounded color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>Personalización</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Ingredientes removibles, extras y selecciones obligatorias.
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<Add />}
          disabled={editor.loading}
          onClick={editor.addEmptyGroup}
          sx={{ textTransform: "none" }}
        >
          Grupo vacío
        </Button>
      </Stack>

      <MenuModifierTemplates disabled={editor.loading} onSelect={editor.addTemplate} />
      <MenuModifierGroups
        groups={editor.groups}
        loading={editor.loading}
        onUpdateGroup={editor.updateGroup}
        onUpdateChoice={editor.updateChoice}
        onAddChoice={editor.addChoice}
        onRemoveChoice={editor.removeChoice}
        onRemoveGroup={editor.removeGroup}
        onSetDefaultChoice={editor.setDefaultChoice}
      />

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          disabled={editor.loading || !editor.hasChanges || editor.saving}
          onClick={editor.save}
          sx={{ textTransform: "none", borderRadius: "8px" }}
        >
          {editor.saving ? "Guardando…" : "Guardar personalización"}
        </Button>
      </Stack>
    </Box>
  );
}

MenuModifierManager.propTypes = {
  menuId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
