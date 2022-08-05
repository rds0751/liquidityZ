import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyAndBalance from "../../components/KeyAndBalance";

export default function Drawer() {
  return (
    <AppBar
      position="fixed"
      style={{
        background: "#2149B9 0% 0% no-repeat padding-box",
        height: "48px",
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {""}
        </Typography>
        <KeyAndBalance chainId={1} />
        <KeyAndBalance chainId={2} />
      </Toolbar>
    </AppBar>
  );
}
