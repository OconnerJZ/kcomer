import { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, Box } from "@mui/material";

const NestedSelectField = ({ levels = [], values, setValues, error, helperText }) => {
  const [options, setOptions] = useState({}); // { levelName: [opciones] }

  // Cargar el primer nivel al montar
  useEffect(() => {
    const loadFirstLevel = async () => {
      if (levels[0]?.fetchOptions) {
        const data = await levels[0].fetchOptions(null); // primer nivel no tiene parent
        setOptions(prev => ({ ...prev, [levels[0].name]: data }));
      }
    };
    loadFirstLevel();
  }, [levels]);

  const handleChange = async (levelIndex, selectedValue) => {
    const level = levels[levelIndex];

    // Actualizar valor del nivel actual
    setValues(prev => ({ ...prev, [level.name]: selectedValue }));

    // Limpiar valores de niveles posteriores
    const updatedValues = { ...values, [level.name]: selectedValue };
    levels.slice(levelIndex + 1).forEach(lvl => {
      updatedValues[lvl.name] = "";
    });
    setValues(updatedValues);

    // Llamar a fetchOptions del siguiente nivel si existe
    const nextLevel = levels[levelIndex + 1];
    if (nextLevel?.fetchOptions) {
      const data = await nextLevel.fetchOptions(selectedValue);
      setOptions(prev => ({ ...prev, [nextLevel.name]: data }));
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
      {levels.map((level, idx) => (
        <FormControl
          key={level.name}
          sx={{ minWidth: 150, flex: 1 }}
          error={!!error && !values[level.name]}
        >
          <InputLabel>{level.label}</InputLabel>
          <Select
            value={values[level.name] || ""}
            onChange={(e) => handleChange(idx, e.target.value)}
          >
            {options[level.name]?.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {!!error && !values[level.name] && (
            <FormHelperText>{helperText || "Este campo es requerido"}</FormHelperText>
          )}
        </FormControl>
      ))}
    </Box>
  );
};

export default NestedSelectField;
