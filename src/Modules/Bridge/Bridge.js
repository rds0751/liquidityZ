//Importing the libraries
import exchange from "../../assets/exchange.png";
import ethereum from "../../assets/ethereum.svg";
import copy from "../../assets/copy.png";
import max from "../../assets/max.png";
import "./FormMain.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import xdc3 from "../../utils/xdc3";
import Web3 from "web3";
import token from "../../utils/xtoken";
import xbridge from "../../utils/xbridge";
import tokenList from "../../contracts/tokenlist.json";
import "react-toastify/dist/ReactToastify.css";
import Bridge from "../../contracts/bridge.json";
import Deploy from "../../contracts/deployer.json";
import BridgeConfirm from "./BridgeConfirm";
import {
  tokenBridge,
  tokenDeployee,
  eBridgeAddress,
  deployee,
  xBridgeAddress,
} from "../../common/constant";
import { toast } from "react-toastify";

//defining the Global variable

let debridgeId,
  submissionId,
  signatures,
  abc,
  transactionHash,
  transactionHashes;
var regexp = /^\d+(\.\d{1,2})?$/;
//Main Function
function BridgeCard() {
  const [buttonText, setButtonText] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txt, setTxt] = useState("");
  const [chainId, setChainId] = useState("");
  let id;
  let accountings;
  toast.configure();

  const onInputChange = (e) => {
    const { value } = e.target;
    console.log("Input value: ", value);

    const re = /^[A-Za-z]+$/;
    if (value === "" || re.test(value)) {
      setTxt(value);
    }
  };

  const colourStyles = {
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#9D9D9D",
      };
    },
  };

  const colourStyless = {
    control: (styles) => ({ ...styles, backgroundColor: "none" }),
    option: (styles, { isDisabled }) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? "red" : "none",

        border: isDisabled ? "1px" : "none",
        borderradius: isDisabled ? "1px" : "none",
        outline: isDisabled ? "1px" : "none",
        cursor: isDisabled ? "not-allowed" : "default",
      };
    },
  };
  const data = [
    {
      value: 3,
      text: "Ethereum",
      icon: "/images/ethereum.svg",
    },
    {
      value: 51,
      text: "XDC",
      icon: "/images/XDC.svg",
    },
  ];

  const dataDestination = [
    {
      value: 51,
      text: "XDC",
      icon: "/images/XDC.svg",
    },
    {
      value: 3,
      text: "Ethereum",
      icon: "/images/ethereum.svg",
    },
  ];

  const [amounterr, setamounterr] = useState("");

  const checkValidation = (e) => {
    const confPassword = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1")
      .replace(/^0[^.]/, "0");

    setamounterr(amounterr);
    // if (!regex.test(e.target.value)) {
    //   setError("amount should greater than 0.1");
    // }
    // setAmount(e.target.value);

    // setError("Passwords Don't Match");
  };

  var regex = /^\d+(\.\d{0,2})?$/g;
  const [selectedOption, setSelectedOption] = useState(null);
  const [icon, setIcon] = useState("");
  // handle onChange event of the dropdown
  const handleChange = (e) => {
    console.log(e);
    setSelectedOption(e);
    setIcon(e?.icon);
    setSelectedOptionDestination(
      e.text === "Ethereum" ? dataDestination[0] : dataDestination[1]
    );
    setText(e.text === "Ethereum" ? "/images/XDC.svg" : "/images/ethereum.svg");
    if (e.text === "Ethereum")
      setSelectedOptionToken(
        tokenList.tokens.find(({ name }) => name === "Ether")
      );
    else {
      setSelectedOptionToken(
        tokenList.tokens.find(({ name }) => name === "XDC")
      );
    }
  };

  const [selectedOptionDestination, setSelectedOptionDestination] =
    useState(null);
  const [name, setName] = useState();
  const [text, setText] = useState("");
  // handle onChange event of the dropdown
  const handleChangeDestination = (e) => {
    setSelectedOptionDestination(e);
    setText(e?.icon);
    setSelectedOption(
      e.text === "Ethereum" ? dataDestination[0] : dataDestination[1]
    );
    setSelectedOptionToken(
      e.name === "Ether" ? dataDestination[0] : dataDestination[1]
    );
    setIcon(e.text === "Ethereum" ? "/images/XDC.svg" : "/images/ethereum.svg");
    if (e.text === "Ethereum")
      setSelectedOptionToken(
        tokenList.tokens.find(({ name }) => name === "XDC")
      );
    else {
      setSelectedOptionToken(
        tokenList.tokens.find(({ name }) => name === "Ether")
      );
    }
  };

  const [selectedOptionToken, setSelectedOptionToken] = useState(null);
  // handle onChange event of the dropdown
  const handleChangeToken = (e) => {
    setSelectedOptionToken(e);
    setText(e?.image);

    setSelectedOptionDestination(
      e.name === "Ether" ? dataDestination[0] : dataDestination[1]
    );
    setSelectedOption(
      e.name === "Ether" ? dataDestination[1] : dataDestination[0]
    );
    setIcon(e.text === "Ether" ? "/images/XDC.svg" : "/images/ethereum.svg");
  };

  const connectWallet = async () => {
    let account = false;
    window.web3.eth.getAccounts((err, accounts) => {
      if (accounts.length === 0) {
        setAddress("Connect Wallet");
        // toast.info('Please Connect to XDCPAY Wallet');
        // window.location.reload(false);
        // alert("Please Connect to The XDCPAY")
        account = false;
      } else {
        accountings = accounts;
        console.log("account", accountings[0]);
        setAddress(accountings[0]);
      }
    });
    id = await window.web3.eth.getChainId();
    console.log("chainid", id);
    abc = id === selectedOption.value;
    setChainId(abc);
    console.log("abc", chainId);
    if (id !== selectedOption.value)
      toast.error("Make sure the Source Network and XDCPay Network are same", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 4000,
      });
  };
  useEffect(() => [selectedOptionDestination, selectedOption, icon, address]);
  return (
    <>
      {/* <div style={{display : "none"}}><BridgeConfirm amount={amount}/> </div> */}
      <div>
        <form>
          <div className="parent-row">
            <div className="fl ">
              <div className="fs-12  c-b pt-3  left-label ">Source</div>
              <Select
                isSearchable={false}
                isClearable={false}
                className="alignLeft input-box-1 fs-12 fw-b rm-border "
                placeholder="Select Option"
                value={selectedOption}
                options={data}
                styles={colourStyless}
                onChange={(e) => {
                  handleChange(e);
                }}
                getOptionLabel={(e) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      style={{ width: "24px", height: "24px" }}
                      src={e.icon}
                    />
                    <span style={{ marginLeft: 5, color: "black" }}>
                      {e.text}
                    </span>
                  </div>
                )}
              />
            </div>
            <div style={{ padding: "76px 11px 0 0px" }}>
              <img
                style={{
                  width: "28px",
                  height: "27px",
                  marginTop: "-36px",
                  marginLeft: "5px",
                  marginRight: "-2.85px",
                }}
                src="/images/Arrow (1).svg"
              />
            </div>
            <div className="fl">
              <div className="fs-12  c-b pt-3  left-label">Destination</div>
              <Select
                isSearchable={false}
                isClearable={false}
                className="alignLeft input-box-1 fs-12 fw-b rm-border"
                placeholder="Select Option"
                value={selectedOptionDestination}
                options={dataDestination}
                onChange={handleChangeDestination}
                styles={colourStyless}
                getOptionLabel={(e) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      style={{ width: "24px", height: "24px" }}
                      src={e.icon}
                    />
                    <span style={{ marginLeft: 5, color: "black" }}>
                      {e.text}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
          <div>
            <div className="fs-12  c-b pt-3    left-label ">Select Token*</div>
            <Select
              isSearchable={false}
              isClearable={false}
              className="alignLeft drop-padding token-select fs-12 fw-b rm-border css-1pahdxg-control"
              placeholder="Select Option"
              value={selectedOptionToken}
              options={tokenList.tokens}
              onChange={handleChangeToken}
              getOptionLabel={(e) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img style={{ marginRight: "5px" }} src={e.image} /> {e.name}
                  <span style={{ marginLeft: 5, color: "black" }}></span>
                </div>
              )}
            />
          </div>

          <div className="fs-12  c-b pt-3  left-label">Amount*</div>

          <div className="amount-box-outer fs-12 fw-b">
            <input
              type="text"
              name="amount"
              autoComplete="off"
              step="0.01"
              className="amount-box-inner fs-12 fw-b rm-border-amount"
              onChange={(e) => {
                const val = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1")
                  .replace(/^0[^.]/, "0")
                  .replace(0.01, "");
                if (regexp.test(e.target.value)) {
                  setAmount("");
                }
                setAmount(val);

                setamounterr(
                  e.target.value > 0.01
                    ? ""
                    : "The minimum amount to send via XDC bridge is 0.02"
                );
              }}
              // Assign State
              value={amount}
              placeholder="0"
            />

            <Link to="#">
              <img
                style={{
                  width: "43px",
                  height: "22px",
                }}
                src={max}
              />
            </Link>
          </div>
          <span className="amounterr">{amounterr}</span>

          <div className="fs-12  c-b pt-3  left-label">
            Destination Address*
          </div>
          <Button onClick={connectWallet}>
            {" "}
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
              {" "}
              {address}
            </div>{" "}
          </Button>
          <Link
            to="/bridge-confirm-transaction"
            state={{
              address,
              amount,
              selectedOptionToken,
              source: `${icon}`,
              destination: `${text}`,
            }}
          >
            {" "}
            <button
              disabled={
                !selectedOptionDestination ||
                !selectedOption ||
                !selectedOptionToken ||
                !amount ||
                !chainId ||
                !address
                  ? true
                  : false
              }
              type="submit"
              className={
                !selectedOptionDestination ||
                !selectedOption ||
                !selectedOptionToken ||
                !amount ||
                !chainId ||
                !address
                  ? "disabled-submit-button"
                  : "submit-button"
              }
            >
              Next
            </button>
          </Link>
          {/* , selectedOption , selectedOptionDestination */}

          {/* <center> <a href={'https://explorer.apothem.network/txs/' + hash} target='_blank' style={{ color: "black", fontSize: "9px" }}> {hash} </a></center>
        <center>  <a href={'https://ropsten.etherscan.io/tx/' + hasher} target='_blank' style={{ color: "black", fontSize: "9px" }}> {hasher} </a> </center> */}
        </form>
      </div>
    </>
  );
}

export default BridgeCard;
