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
import { color } from "@mui/system";

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
  const [buttonState, setButtonState] = useState(false)
  const [address, setAddress] = useState("Collect Wallet");
  const [amount, setAmount] = useState("");
  const [txt, setTxt] = useState("");
  const [chainId, setChainId] = useState("");
  let accountings;
  let id;
  let abc;
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
        backgroundColor: isDisabled ? "red" : "",
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

  // const [amounterr, setamounterr] = useState("");

  // const checkValidation = (e) => {
  //   const confPassword = e.target.value
  //     .replace(/[^0-9.]/g, "")
  //     .replace(/(\..*?)\..*/g, "$1")
  //     .replace(/^0[^.]/, "0");

  //   setamounterr(amounterr);

  //   setError("Passwords Don't Match");
  // };

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
    setIcon(e.text === "Ethereum" ? "/images/XDC.svg" : "/images/ethereum.svg");
  };

  const handleWalletChange = (e) => {
    e.preventDefault()
    setButtonState(!buttonState)
  }
  const [selectedOptionToken, setSelectedOptionToken] = useState(null);
  // handle onChange event of the dropdown
  const handleChangeToken = (e) => {
    setSelectedOptionToken(e);
    if (e.chainId != selectedOption.value) {
      toast.error("Select Proper Token ", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 15000,
      });
      console.log(" sczndzjn", selectedOption.value);
      console.log(" nkjsnd", e.chainId);
    }
  };

  const connectWallet = async (e) => {
    e.preventDefault()
    let account = false;

    // console.log("Connect Wallet called")

    if (address !== "Collect Wallet") {
      setAddress("Collect Wallet")
      return
    }
    window.web3.eth.getAccounts((err, accounts) => {
      if (accounts.length === 0) {
        setAddress("Connect Wallet");
        // toast.info('Please Connect to XDCPAY Wallet');
        // window.location.reload(false);
        // alert("Please Connect to The XDCPAY")
        account = false;
      } else {
        accountings = accounts;
        // console.log("account", accountings[0]);
        setAddress(`Disconnect ${accountings[0]}`);
      }
    });

    id = await window.web3.eth.getChainId();
    // console.log("chainid", id);

    // abc = id === selectedOption.value;
    // setChainId(abc);
    // console.log("abc", chainId);
    // if (id !== selectedOption.value)
    //   toast.error(
    //     "Make sure you the Source Network and XDCPay Network are same",
    //     { position: toast.POSITION.TOP_CENTER, autoClose: 4000 }
    //   );
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
                className="alignLeft input-box-1 fs-12 fw-b rm-border"
                placeholder="Select Option"
                value={selectedOption}
                options={data}
                styles={colourStyless}
                onChange={(e) => {
                  handleChange(e);
                }}
                getOptionLabel={(e) => (
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }} className="focus:bg-none">
                      <img
                        style={{ width: "24px", height: "24px" }}
                        src={e.icon}
                      />
                      <span style={{ marginLeft: 5, color: "black" }}>
                        {e.text}
                      </span>
                    </div>
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
                  .replace(/^0[^.]/, "0");
                setAmount(val);
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

          <div className="fs-12  c-b pt-3  left-label">
            Destination Address*
          </div>
          {/* <Button onClick={connectWallet}>
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
          </Button> */}
          <button className="bg-transparent text-blue-700 py-2 px-4 border-1 border-blue-500 rounded-full w-full mt-2 cursor-pointer btn-connect" onClick={(e) => connectWallet(e)}>
            {address === "Collect Wallet" ? address : (<div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mr-2">
                <g id="Disconnect" transform="translate(12559 -523)">
                  <rect id="Rectangle_103" data-name="Rectangle 103" width="24" height="24" transform="translate(-12559 523)" fill="none" />
                  <g id="noun-disconnect-3367979" transform="translate(-12555 524)">
                    <path id="Path_857" data-name="Path 857" d="M228.542,232.307a4.7,4.7,0,0,1-6.746-5.828l2.426-5.887a.522.522,0,1,0-.965-.4l-2.43,5.887a5.742,5.742,0,0,0,8.247,7.123.522.522,0,1,0-.532-.9Z" transform="translate(-220.393 -212.871)" fill="#2358e5" stroke="#2358e5" stroke-width="1" />
                    <path id="Path_858" data-name="Path 858" d="M335.016,103.207a5.685,5.685,0,0,0-5.115.37.522.522,0,1,0,.533.9,4.7,4.7,0,0,1,6.743,5.829l-2.388,5.795a.522.522,0,0,0,.283.681.508.508,0,0,0,.2.04.522.522,0,0,0,.482-.323l2.388-5.795h0a5.747,5.747,0,0,0-3.123-7.493Z" transform="translate(-323.109 -102.768)" fill="#2358e5" stroke="#2358e5" stroke-width="1" />
                    <path id="Path_859" data-name="Path 859" d="M275.661,111.618a.522.522,0,1,0-.964.4L282.64,131.1a.522.522,0,0,0,.482.322.536.536,0,0,0,.2-.042.522.522,0,0,0,.282-.683Z" transform="translate(-271.419 -110.787)" fill="#2358e5" stroke="#2358e5" stroke-width="1" />
                  </g>
                </g>
              </svg>
              {address}
            </div>)}


          </button>
          {/* <Button variant="outline-primary" className="w-100 mt-1 btn-connect" onClick={handleWalletChange} >{address ? "Disconnect Wallet" : "Connect Wallet"}</Button> */}
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
                  !chainId ||
                  !amount ||
                  !address
                  ? true
                  : false
              }
              type="submit"
              className={
                !selectedOptionDestination ||
                  !selectedOption ||
                  !selectedOptionToken ||
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
