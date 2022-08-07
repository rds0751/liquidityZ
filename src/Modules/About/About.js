//Importing the libraries
import { Box } from "@mui/system";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import "./index.css";
import web3 from "../../utils/web3";
import xdc3 from "../../utils/xdc3";
import Web3 from "web3";
import { NETWORKS } from "../../common/constant";
import Jazzicon from "react-jazzicon";
import CardActionArea from "@mui/material/CardActionArea";
import { Card } from "@mui/material";
import { Link } from "react-router-dom";
//Main function
export default function About() {
  function truncateString(str, num) {
    if (str.length > 14) {
      return str.slice(0, 14) + "..." + str.slice(37, str.length - 1);
    } else {
      return str;
    }
  }
  let accountings;
  const [buttonText, setButtonText] = useState("");
  const [popup, setPopup] = useState(1);
  const [accounting, setAccount] = useState("");
  toast.configure();
  window.web3 = new Web3(window.xdc ? window.xdc : window.ethereum);
  const handleXDCPayWallet = async () => {
    if (window.web3.currentProvider) {
      if (!window.web3.currentProvider.hasOwnProperty("chainId")) {
        if (!window.xdc) {
          setPopup(2);
          alert();
        } else {
          const state = window.web3.givenProvider.publicConfigStore
            ? window.web3.givenProvider.publicConfigStore._state
            : window.web3.currentProvider.publicConfigStore._state;
          let address = state.selectedAddress;
          let network =
            state.networkVersion === "50"
              ? NETWORKS.XDC_MAINNET
              : NETWORKS.XDC_APOTHEM_TESTNET;
        }
      }
    }
  };
  let account = false;
  window.web3.eth.getAccounts((err, accounts) => {
    if (accounts.length === 0) {
      setButtonText("Connect Wallet");
      // toast.info('Please Connect to XDCPAY Wallet');
      // window.location.reload(false);
      // alert("Please Connect to The XDCPAY")
      account = false;
    } else {
      accountings = accounts;
      setButtonText(truncateString(accounts.toString()));
    }
  }); 
  return (
    <div>
      <Box
        className="content-box"
        display="grid"
        alignItems="center"
        justifyContent="center"
      >
        <h2
          style={{
            width: "347px",
            height: "30px",
            marginLeft: "210px",
            letterspacing: "0px",
            color: "#102C78",
            opacity: "1",
            textalign: "left",
          }}
        >
          Welcome to LiquidityZ
        </h2>
        <div>
          <Button
            onClick={() => handleXDCPayWallet()}
            className="connect-wallet btn-primary label"
            variant="primary"
          >
            {" "}
            <div
              style={{
                display: "flex",
                alignContent: "top",
              }}
            >
              <Jazzicon
                diameter={28}
                seed={Math.round(Math.random() * 10000000)}
              />
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: " normal normal 600 18px/21px",
                  paddingTop: "5px",
                  textAlign: "left",
                  opacity: "1",
                  marginLeft: "34px",
                }}
              >
                {buttonText}
              </div>
            </div>
          </Button>{" "}
        </div>
      </Box>
      <Grid
        item
        xs={12}
        style={{ marginTop: "52px", marginLeft: "200px", paddingTop: "26px" }}
      >
        <Grid container justifyContent="center" spacing={3}>
          <Grid item>
            <Card
              sx={{
                height: 327,
                width: 230,
              }}
              className="card-paper"
            >
              <CardActionArea style={{display: 'block'}} component={Link} to="/bridge">
                <img src="/images/Bridge.svg" alt="bridge" className="w-full text-center h-24 -ml-2"/>
                <p className="p-heading">ZPROTOCOLS</p>
                <p className="p-subheading">
                  Transfer data (e.g. digital asset ownership information)
                  between two chains
                </p>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item>
            <Card
              sx={{
                height: 327,
                width: 230,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#1A2027" : "#fff",
              }}
              className="card-paper"
            >
              <CardActionArea style={{display: 'block'}} component={Link} to="/swap">
                <img src="/images/Swap_1.svg" alt="swap" className="w-full text-center h-24 -ml-2"/>
                <p className="p-heading">ZSWAPS</p>
                <p className="p-subheading">
                  Swap tokens supported on XDC Network
                </p>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item>
            <Card
              sx={{
                height: 327,
                width: 230,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#1A2027" : "#fff",
              }}
              className="card-paper"
            >
              <CardActionArea style={{display: 'block'}} component={Link} to="/pool">
                <img src="/images/Pool.svg" alt="swap" className="w-full text-center h-24 -ml-2"/>
                <p className="p-heading">ZPOOLS</p>
                <p className="p-subheading">
                  Add your token pair to the pool and earn whenever there is a
                  swap
                </p>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item>
            <Card
              sx={{
                height: 327,
                width: 230,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#1A2027" : "#fff",
              }}
              className="card-paper"
            >
              <CardActionArea style={{display: 'block'}} component={Link} to="/market">
                <img src="/images/Market.svg" alt="swap" className="w-full text-center h-24 -ml-2"/>
                <p className="p-heading">ZMARKETS</p>
                <p className="p-subheading">
                  Analyse the top performing tokens and pairs
                </p>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
