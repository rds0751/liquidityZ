import React, { useState, useEffect } from "react";
import { formatUnits, parseUnits } from "@ethersproject/units";
// import toast from 'react-toastify';
import { toast } from "react-toastify";
import XDC3 from "xdc3";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import xdc3 from "../../utils/xdc3";
import Web3 from "web3";
import token from "../../utils/xtoken";
import { Link, useLocation, useNavigate } from "react-router-dom";
import xbridge from "../../utils/xbridge";
import tokenList from "../../contracts/tokenlist.json";
import Bridge from "../../contracts/Gate.json";
import Deploy from "../../contracts/deployer.json";
import DeBridgeGateJson from "../../contracts/Gate.json";
import { TailSpin } from "react-loader-spinner";
import { Button } from "react-bootstrap";
import "react-step-progress/dist/index.css";
import ebridge from "../../utils/ebridge";
import { signSendAndConfirm } from "../../utils/solana";
import {
  Connection,
  Keypair,
  PublicKey,
  TokenAccountsFilter,
  Transaction,
} from "@solana/web3.js";
import {
  tokenBridge,
  tokenDeployee,
  eBridgeAddress,
  deployee,
  xBridgeAddress
} from "../../common/constant";
import {
	Token,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import {
  WalletContextState
} from '@solana/wallet-adapter-react'
import {
  
  approveEth,
  attestFromEth,
  attestFromSolana,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  createWrappedOnEth,
  createWrappedOnSolana,
  getEmitterAddressEth,
  getEmitterAddressSolana,
  getForeignAssetEth,
  getForeignAssetSolana,
  getIsTransferCompletedEth,
  getIsTransferCompletedSolana,
  hexToUint8Array,
  nativeToHexString,
  parseSequenceFromLogEth,
  parseSequenceFromLogSolana,
  postVaaSolana,
  redeemOnEth,
  redeemOnSolana,
  textToUint8Array,
  TokenImplementation__factory,
  transferFromEth,
  transferFromSolana,
  tryNativeToHexString,
  tryNativeToUint8Array,
  uint8ArrayToHex,
  updateWrappedOnEth,
  WormholeWrappedInfo,
  setDefaultWasm,
  safeBigIntToNumber
} from '@certusone/wormhole-sdk';
import {
  ETH_CORE_BRIDGE_ADDRESS,
  ETH_PRIVATE_KEY,
  TEST_ERC20,
  TEST_SOLANA_TOKEN
} from "./consts";
import web3 from "../../utils/web3";
import { 
  SOLANA_HOST,
  ETH_TOKEN_BRIDGE_ADDRESS,
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS
 } from "../../utils/consts";
const { ethers } = require("ethers");

const CORE_ID = BigInt(4);
const TOKEN_BRIDGE_ID = BigInt(6);

export default function App() {
  const [show, setShow] = useState(false);
  const [hash, setHash] = useState("");
  const [hasher, setHasher] = useState("");
  const [progress, setProgress] = useState(0);
  let solAddress;
  toast.configure();
  const navigate = useNavigate()
  const OnSubmit = async () => {
    const getProvider = () => {
      if ('phantom' in window) {
        const provider = window.phantom?.solana;
    
        if (provider?.isPhantom) {
          return provider;
        }
      }
      window.open('https://phantom.app/', '_blank');
    };
    const solProvider = getProvider(); // see "Detecting the Provider"
    const connection = new Connection(SOLANA_HOST, "confirmed");
    try {
        const resp = await solProvider.connect();
        solAddress = resp.publicKey.toString();
        console.log(solAddress, 'add', resp.publicKey.toString());
        // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo 
    } catch (err) {
        console.log(err.message)
    }
    // create a signer for Eth
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Target Address:", await signer.getAddress());
    const targetAddress = await signer.getAddress();
    // create a keypair for Solana]
    const payerAddress = solAddress.toString();
    // find the associated token account
    const solanaMintKey = new PublicKey(
      (await getForeignAssetSolana(
        connection,
        SOL_TOKEN_BRIDGE_ADDRESS,
        CHAIN_ID_ETH,
        hexToUint8Array(nativeToHexString('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', CHAIN_ID_ETH) || "")
      )) || ""
    );
    const fromAddress = (
      await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        solanaMintKey,
        new PublicKey(solAddress)
      )
    ).toString();
    console.log('From Address:', fromAddress);

    // Get the initial solana token balance
    const tokenFilter = {
      programId: TOKEN_PROGRAM_ID,
    };
    let results = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(solAddress),
      tokenFilter
    );
    let initialSolanaBalance = 0;
    for (const item of results.value) {
      const tokenInfo = item.account.data.parsed.info;
      const address = tokenInfo.mint;
      const amount = tokenInfo.tokenAmount.uiAmount;
      if (tokenInfo.mint === TEST_SOLANA_TOKEN) {
        initialSolanaBalance = amount;
      }
    }

    // Get the initial wallet balance on Eth
    const originAssetHex = tryNativeToHexString(
      TEST_SOLANA_TOKEN,
      CHAIN_ID_SOLANA
    );
    if (!originAssetHex) {
      throw new Error("originAssetHex is null");
    }
    const foreignAsset = await getForeignAssetEth(
      ETH_TOKEN_BRIDGE_ADDRESS,
      provider,
      CHAIN_ID_SOLANA,
      hexToUint8Array(originAssetHex)
    );
    console.log('foreign', foreignAsset);
    if (!foreignAsset) {
      throw new Error("foreignAsset is null");
    }
    let token = TokenImplementation__factory.connect(
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // TODO: MAKE IT DYNAMIC
      signer
    );
    console.log(targetAddress);
    const initialBalOnEth = await token.balanceOf(
      targetAddress
    );
    const initialBalOnEthFormatted = formatUnits(initialBalOnEth._hex, 9);
    console.log('balance before transfer', initialBalOnEthFormatted);

    // transfer the test token
    const amount = parseUnits("843711", 0).toBigInt();
    const promise = transferFromSolana(
      connection,
      SOL_BRIDGE_ADDRESS,
      SOL_TOKEN_BRIDGE_ADDRESS,
      payerAddress,
      fromAddress,
      TEST_SOLANA_TOKEN,
      amount,
      tryNativeToUint8Array(targetAddress, CHAIN_ID_ETH),
      2,
      undefined,
      undefined,
      undefined,
      parseUnits("0", 0).toBigInt() 
    );
    console.log(
      connection,
      SOL_BRIDGE_ADDRESS,
      SOL_TOKEN_BRIDGE_ADDRESS,
      payerAddress,
      fromAddress,
      TEST_SOLANA_TOKEN,
      amount,
      tryNativeToUint8Array(targetAddress, CHAIN_ID_ETH),
      2,
      undefined,
      2,
      undefined,
      parseUnits("0", 0).toBigInt()
    );
    const transaction = await promise;
    const txid = await signSendAndConfirm(solProvider, connection, transaction);
    // const { signature } = await solProvider.signAndSendTransaction(transaction);
    // await connection.getSignatureStatus(signature);
    // sign, send, and confirm transaction
    // transaction.partialSign(keypair);
    // const txid = await connection.sendRawTransaction(
    //   transaction.serialize()
    // );
    console.log('working');
    await connection.confirmTransaction(txid);
    const info = await connection.getTransaction(txid);
    if (!info) {
      throw new Error(
        "An error occurred while fetching the transaction info"
      );
    }
    // get the sequence from the logs (needed to fetch the vaa)
    const sequence = parseSequenceFromLogSolana(info);
    const emitterAddress = await getEmitterAddressSolana(
      SOLANA_TOKEN_BRIDGE_ADDRESS
    );
    // poll until the guardian(s) witness and sign the vaa
    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_SOLANA,
      emitterAddress,
      sequence,
      {
        transport: NodeHttpTransport(),
      }
    );
    await redeemOnEth(ETH_TOKEN_BRIDGE_ADDRESS, signer, signedVAA);

    // Get final balance on Solana
    results = await connection.getParsedTokenAccountsByOwner(
      keypair.publicKey,
      tokenFilter
    );
    let finalSolanaBalance = 0;
    for (const item of results.value) {
      const tokenInfo = item.account.data.parsed.info;
      const address = tokenInfo.mint;
      const amount = tokenInfo.tokenAmount.uiAmount;
      if (tokenInfo.mint === TEST_SOLANA_TOKEN) {
        finalSolanaBalance = amount;
      }
    }

    // Get the final balance on Eth
    const finalBalOnEth = await token.balanceOf(
      ETH_TEST_WALLET_PUBLIC_KEY
    );
    const finalBalOnEthFormatted = formatUnits(finalBalOnEth._hex, 9);
  };
  useEffect(() => {
    OnSubmit();
  }, []);
  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [show_Hide_Image, setShowHideImage] = useState("none");
  const [showBtn, setShowBtn] = useState(false);
  const [a, setA] = useState(false);
  const [progressText, setProgressText] = useState("Show Image Component");
  const handleDoneClick = () => {
    navigate("/bridge")
  }
  const letToggle = () => {

    if (show_Hide_Image === "flex") {
      setA(true);
      setSpinnerLoading(true);
      setShowHideImage("none");
      setProgressText("Transfering the Amount");
    } else {
      setSpinnerLoading(false);
      setShowHideImage(true);
      setProgressText("Transfering the Amount");
    }
    // navigate("/about")
  };
  return (
    <div className="App">
      <ProgressBar
        filledBackground="#20AA15"
        hasStepZero="false"
        height="1px"
        percent={progress}
      >
        <Step>
          {({ accomplished, index }) => (
            <>
              <div
                className={`indexedStep ${
                  accomplished ? "accomplished" : null
                }`}
              >
                {index + 1}
              </div>
              <div className={"test"}>Transfer</div>
            </>
          )}
        </Step>
        <Step>
          {({ accomplished, index }) => (
            <>
              <div
                className={`indexedStep ${
                  accomplished ? "accomplished" : null
                }`}
              >
                {index + 1}
              </div>
              <div className={"test"}>Confirmation</div>
            </>
          )}
        </Step>
        <Step>
          {({ accomplished, index }) => (
            <>
              <div
                className={`indexedStep ${
                  accomplished ? "accomplished" : null
                }`}
              >
                {index + 1}
              </div>
              <div className={"test"}>Recieve</div>
            </>
          )}
        </Step>
      </ProgressBar>
      <div className="done">
        <TailSpin
          color="#2358E5"
          height={70}
          width={70}
          visible={spinnerLoading}
        />
        <img
          style={{ display: show_Hide_Image }}
          className="successImg"
          src="/images/successful.svg"
          alt="Successful"
        ></img>
        <Link
          className={a ? "viewOnXDCText" : "viewOnXDCTextDisable"}
          to={{
            pathname: "/courses",
            search: "?sort=name",
            hash: "#the-hash",
            state: { fromDashboard: true },
          }}
        >
          View on XDC Explorer
        </Link>
        <center>
          {" "}
          <p style={{ color: "black", fontSize: "12px" }}> {hash} </p>
        </center>
        <Link
          className={a ? "viewOnXDCText" : "viewOnXDCTextDisable"}
          to={{
            pathname: "/courses",
            search: "?sort=name",
            hash: "#the-hash",
            state: { fromDashboard: true },
          }}
        >
          View on EtherScan
        </Link>
        <center>
          {" "}
          <p style={{ color: "black", fontSize: "12px" }}> {hasher} </p>{" "}
        </center>
        {showBtn && <Button onClick={() => {
          letToggle()
          handleDoneClick()
        }} className="done-button margintp">
          Done
        </Button>}
      </div>
      <center>
        {" "}
        <a
          href={"https://explorer.apothem.network/txs/" + hash}
          target="_blank"
          style={{ color: "black", fontSize: "12px" }}
        >
          {" "}
          {hash}{" "}
        </a>
      </center>
      <center>
        {" "}
        <a
          href={"https://ropsten.etherscan.io/tx/" + hasher}
          target="_blank"
          style={{ color: "black", fontSize: "12px" }}
        >
          {" "}
          {hasher}{" "}
        </a>{" "}
      </center>
    </div>
  );
}
