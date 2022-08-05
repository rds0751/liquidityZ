import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import classnames from "classnames";
import MuiListItem from "@material-ui/core/ListItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import "./index.css";
import { useEffect } from "react";
// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

// const ListItem = withStyles({
//   root: {
//     "&$selected": {
//       color: "white",
//       "& .MuiListItemIcon-root": {
//         color: "white",
//       },
//     },
//     "&$selected:hover": {
//       color: "white",
//       "& .MuiListItemIcon-root": {
//         color: "white",
//       },
//     },
//     "&:hover": {
//       color: "white",
//       "& .MuiListItemIcon-root": {
//         color: "white",
//       },
//     },
//   },
//   selected: {},
// })(MuiListItem);
function changeBackground(e) {
  e.target.style.background = "red";
}

const drawerWidth = 200;
export default function SideBar() {
  // const classes = useStyles();

  // const [selectedIndex, setSelectedIndex] = React.useState(1);
  // const handleListItemClick = (index) => {
  //   setSelectedIndex(index);
  // };

  const pathName = window.location.pathname?.split("/");
  const currSection = pathName?.length ? pathName[pathName.length - 1] : "";

  const [aboutIcon, setAboutIcon] = React.useState(
    "/images/noun_Home_coloured.svg"
  );
  const [bridgeIcon, setBridgeIcon] = React.useState(
    "/images/bridge_Colored.svg"
  );
  const [historyIcon, setHistoryIcon] = React.useState(
    "/images/history_Coloured.svg"
  );
  const changeSourceForIcons = (value) => {
    if (value === "about") setAboutIcon("/images/noun_Home_white.svg");
    if (value === "bridge") setBridgeIcon("/images/bridge_White.svg");
    if (value === "history") setHistoryIcon("/images/history_White.svg");
  };
  const changeOriginalSourceForIcons = (value) => {
    if (value === "about") setAboutIcon("/images/noun_Home_coloured.svg");
    if (value === "bridge") setBridgeIcon("/images/bridge_Colored.svg");
    if (value === "history") setHistoryIcon("/images/history_Coloured.svg");
  };
  const [wallet, setWallet] = React.useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
        className="drawer-content"
      >
        <div>
          <Toolbar>
            <img
              style={{ width: "134px", height: "134px", marginLeft: "7px", marginTop: "31px" }}
              src="https://imgur.com/lfWtixh.png"
            ></img>{" "}
          </Toolbar>
        </div>
        <List style={{ paddingTop: "108px" }}>
          <ListItem
            className="list-item"
            button
            component={Link}
            to="/about"
          >
            <ListItemIcon>
              <img
                style={{ paddingLeft: "10px" }}
                src={
                  currSection === "about"
                    ? "/images/noun_Home_white.svg"
                    : "/images/noun_Home_coloured.svg"
                }
              ></img>
            </ListItemIcon>
            <ListItemText
              className={
                currSection === "about" ? "selected-text" : "list-text"
              }
            >
              About
            </ListItemText>
          </ListItem>

          <ListItem
            className="list-item"
            button
            // selected={selectedIndex === 2}
            // onClick={(event) => handleListItemClick(2)}
            // onMouseOver={() => changeSourceForIcons("bridge")}
            // onMouseOut={() => changeOriginalSourceForIcons("bridge")}
            component={Link}
            to="/bridge"
          >
            <ListItemIcon>
              <img
                style={{ paddingLeft: "10px" }}
                src={
                  currSection === "bridge"
                    ? "/images/bridge_White.svg"
                    : "/images/bridge_Colored.svg"
                }
              ></img>
            </ListItemIcon>
            <ListItemText
              className={
                currSection === "bridge" ? "selected-text" : "list-text"
              }
            >
              Bridge
            </ListItemText>
          </ListItem>

          <ListItem className="list-item" button component={Link} to="/market">
            <ListItemIcon>
              <img
                style={{ paddingLeft: "10px" }}
                src={
                  currSection === "market"
                    ? "/images/chart_white.svg"
                    : "/images/chart_coloured.svg"
                }
              ></img>
            </ListItemIcon>
            <ListItemText
              className={
                currSection === "market" ? "selected-text" : "list-text"
              }
            >
              Market
            </ListItemText>
          </ListItem>

          <ListItem
            className="list-item flex items-center  justify-start"
            button
            // selected={selectedIndex === 3}
            // onClick={(event) => handleListItemClick(3)}
            // onMouseOver={() => changeSourceForIcons("history")}
            // onMouseOuts={() => changeOriginalSourceForIcons("history")}
            component={Link}
            to="/history"
          >
            <ListItemIcon>
              <img
                style={{ paddingLeft: "10px" }}
                src={
                  currSection === "history"
                    ? "/images/history_White.svg"
                    : "/images/history_Coloured.svg"
                }
              ></img>
            </ListItemIcon>
            <ListItemText
              className={classnames(
                { "selected-text": currSection === "history" },
                { "list-text": currSection !== "history" },
                "flex"
              )}
            >
              History
            </ListItemText>
          </ListItem>
        </List>
        <div style={{ position: "absolute", bottom: "0", left: "18px" }}>
          <div style={{ marginLeft: "14px" }}>
            {
              <p className="powered">
                V1.0
                <img style={{width: "110px"}} src="https://www.portalbridge.com/static/media/portal_logo_w.484271a5c853855c2a4436a34d082aed.svg"></img>
              </p>
            }
          </div>
        </div>
      </Drawer>
    </Box>
  );
}
