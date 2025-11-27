import { useFilterMenu } from "@Context/FilterMenuContext";
import useGeolocation from "@Hooks/components/useGeolocation";
import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { Card, Drawer } from "antd";
import { useState } from "react";
import { Icon } from "@iconify/react";

const options = ["Option 1", "Option 2"];

const FiltersPanel = () => {
  const { address } = useGeolocation();
  const { visible } = useFilterMenu();
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Box
        sx={{
          zIndex: 1000,
          position: "fixed",
          top: { xs: "0px", sm: "56px", md: "64px" },
          width: "100%",
          padding: "3px",
          // backgroundColor: "rgba(150,30,173,0.5)",
          // backgroundColor: "rgba(237,167,33,0.7)",
          backgroundImage: "radial-gradient(circle at 56.6% 38.56%, #fffbae 5%, #ffe9a6 15%, #d8b46c 50%, #c99f54 75%, #bd8c40 100%)",
          // backgroundImage: "radial-gradient(circle at 50% 50%, #f8e3a4 0, #eacd8a 25%, #d8b46c 50%, #c79b50 75%, #b98638 100%)",
          // backgroundImage: "radial-gradient(circle at 50% 50%, #f4dc9b 0, #e7c985 25%, #d8b46c 50%, #c99f54 75%, #bd8c40 100%)",
          color: "#000",
          backdropFilter: "blur(5px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s",
          letterSpacing: "0.5px"
          // borderBottom: "1px solid rgb(255, 64, 59)"
        }}
      >
        <p>{address}</p>
        <IconButton onClick={() => showDrawer(true)}>
          <Search />
        </IconButton>
      </Box>
      <Drawer
        title=""
        placement="top"
        onClose={onClose}
        open={open}
        className="panelFilter"
      >
        <Grid
          container
          spacing={5}
          justifyContent={"center"}
          alignItems={"center"}
          mt={2}
        >
          <Grid item>
            <Paper elevation={3}>
              <Card
                className="filterPanel"
                title={
                  <Icon
                    style={{ fontSize: "40px", color: "#D02828" }}
                    icon={"ion:location"}
                  />
                }
                bordered={false}
                style={{
                  width: 300,
                }}
              >
                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  id="controllable-states-demo"
                  options={options}
                  renderInput={(params) => (
                    <TextField {...params} label="Ubicación" />
                  )}
                />
              </Card>
            </Paper>
          </Grid>
          <Grid item>
            {" "}
            <Paper elevation={3}>
              <Card
                className="filterPanel"
                title={
                  <Icon
                    style={{ fontSize: "40px", color: "#E3A024" }}
                    icon={"ion:fast-food"}
                  />
                }
                bordered={false}
                style={{
                  width: 300,
                }}
              >
                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  id="controllable-states-demo"
                  options={options}
                  renderInput={(params) => (
                    <TextField {...params} label="Comida" />
                  )}
                />
              </Card>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={3}>
              <Card
                className="filterPanel"
                title={
                  <Icon
                    style={{ fontSize: "40px", color: "#003085" }}
                    icon={"fluent:person-feedback-48-filled"}
                  />
                }
                bordered={false}
                style={{
                  width: 300,
                }}
              >
                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  id="controllable-states-demo"
                  options={options}
                  renderInput={(params) => (
                    <TextField {...params} label="Feedback" />
                  )}
                />
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
};

export default FiltersPanel;
