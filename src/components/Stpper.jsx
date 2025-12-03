import { useState } from "react";
import { IconButton, Typography, Paper } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const Stpper = ({ initial = 1, min = 0, onChange }) => {
  const [value, setValue] = useState(initial);

  const handleIncrement = () => {
    const next = value + 1;
    setValue(next);
    if (onChange) onChange(next);
  };

  const handleDecrement = () => {
    if (value > min) {
      const next = value - 1;
      setValue(next);
      if (onChange) onChange(next);
    }
  };
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "max-content"
      }}
    >
      <IconButton
        color="primary"
        onClick={handleDecrement}
        aria-label="decrement"
      >
        <Remove />
      </IconButton>

      <Typography
        sx={{ fontWeight: 600, minWidth: 20, textAlign: "center" }}
      >
        {value}
      </Typography>

      <IconButton
        color="primary"
        onClick={handleIncrement}
        aria-label="increment"
      >
        <Add />
      </IconButton>
    </Paper>
  );
};

export default Stpper;
