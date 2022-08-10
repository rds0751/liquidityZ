import React, { useState } from "react";
import Header from "../Common/header";
import SideBar from "../Common/drawer";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import { Modal } from "react-bootstrap";
import ProgressBar from "./Progress1";
import ProgressBar1 from "./Progress";
import { Link, useLocation } from "react-router-dom";
//Main Function
function BridgeConfirm() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(false);
  return (
    <>
      <Box>
        <Header />
        <SideBar />
        <div>
          <div className="main-head" style={{ justifyContent: "space-between" }}>
            <p>Ethereum 1492</p>
          </div>
          <div className="my-card my-card-second">
            <p className="review">Transaction Details</p>
            <Divider className="mb-23" />
            <div className="image-flex">
              <img className="token-img" src='/images/XDC.svg'></img>
              <img src="/images/Arrow.svg" alt="sachin"></img>
              <img
                className="token-img"
                src="/images/ethereum.svg"
              ></img>
            </div>
            <div className="asset-flex">
              <p className="content">Protocol</p>
              <p className="second-p sub-content">
                Ethereum AAVE V2
              </p>
            </div>
            <Divider className="mb-23" />
            <div className="asset-flex">
              <p className="content">Task</p>
              <p className="sub-content">Lending</p>
            </div>
            <Divider className="mb-23" />
            <div className="asset-flex">
              <p className="content">Asset</p>
              <p className="sub-content">USDC</p>
            </div>
            <Divider className="mb-23" />
            <div className="asset-flex">
              <p>Amount</p>
              <p>1</p>
            </div>
            <Divider className="mb-23" />
            <ProgressBar />
          </div>
        </div>
      </Box>
    </>
  );
}
export default BridgeConfirm;
