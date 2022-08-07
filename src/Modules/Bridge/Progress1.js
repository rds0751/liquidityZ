import React, { useState, useEffect } from "react";
// import toast from 'react-toastify';
import { toast } from 'react-toastify';
import "./styles.css";
import 'react-toastify/dist/ReactToastify.css';
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { Link, useLocation } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import "react-step-progress/dist/index.css";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";
import "react-step-progress-bar/styles.css";
import token from "../../utils/xtoken";
import "react-step-progress/dist/index.css";
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
  safeBigIntToNumber,
  getSignedVAAWithRetry
} from '@certusone/wormhole-sdk';
import {
  ETH_CORE_BRIDGE_ADDRESS,
  ETH_PRIVATE_KEY,
  TEST_ERC20,
  TEST_SOLANA_TOKEN
} from "./consts";
import { useSolanaWallet } from "../../contexts/SolanaWalletContext";
import useIsWalletReady from "../../hooks/useIsWalletReady";
import { 
  SOLANA_HOST,
  ETH_TOKEN_BRIDGE_ADDRESS,
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
  WORMHOLE_RPC_HOSTS
 } from "../../utils/consts"
 const { ethers } = require("ethers");
import abi from "../../contracts/aave.json";


export default function App() {
  const [hash, setHash] = useState("");
  const [hasher, setHasher] = useState("");
  const [progress, setProgress] = useState(0);
  const solanaWallet = useSolanaWallet();
  let solAddress;
  toast.configure();



  const OnSubmit = async () => {
    setProgress(0);
    // setHasher('transactionHashes');
    // setHash('aas');
    
    setProgress(progress+8)
    const getProvider = () => {
      if ('phantom' in window) {
        setProgress(progress+8)
        const provider = window.phantom?.solana;
    
        if (provider?.isPhantom) {
          return provider;
        }
      }
      window.open('https://phantom.app/', '_blank');
    };
    setProgress(progress+8)
    const solProvider = getProvider(); // see "Detecting the Provider"
    setProgress(progress+8)
    const connection = new Connection(SOLANA_HOST, "confirmed");
    try {
      setProgress(progress+8)  
      const resp = await solProvider.connect();
        solAddress = resp.publicKey.toString();
        console.log(solAddress, 'add', resp.publicKey.toString());
        // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo 
    } catch (err) {
        console.log(err.message)
    }
    // create a signer for Eth
    setProgress(progress+8)
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    setProgress(progress+8)
    const signer = provider.getSigner();
    console.log("Target Address:", await signer.getAddress());
    setProgress(progress+8)
    const targetAddress = await signer.getAddress();
    // create a keypair for Solana]
    setProgress(progress+8)
    const payerAddress = solAddress.toString();
    // find the associated token account
    setProgress(progress+8)
    const solanaMintKey = new PublicKey(
      (await getForeignAssetSolana(
        connection,
        SOL_TOKEN_BRIDGE_ADDRESS,
        CHAIN_ID_ETH,
        hexToUint8Array(nativeToHexString('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', CHAIN_ID_ETH) || "")
      )) || ""
    );
    setProgress(progress+8)
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
    setProgress(progress+8)
    const tokenFilter = {
      programId: TOKEN_PROGRAM_ID,
    };
    let results = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(solAddress),
      tokenFilter
    );
    let initialSolanaBalance = 0;
    for (
      const item of results.value) {
      setProgress(progress+8)
      const tokenInfo = item.account.data.parsed.info;
      setProgress(progress+8)
      const address = tokenInfo.mint;
      setProgress(progress+8)
      const amount = tokenInfo.tokenAmount.uiAmount;
      if (tokenInfo.mint === TEST_SOLANA_TOKEN) {
        initialSolanaBalance = amount;
      }
    }

    // Get the initial wallet balance on Eth
    setProgress(progress+8)
    const originAssetHex = tryNativeToHexString(
      TEST_SOLANA_TOKEN,
      CHAIN_ID_SOLANA
    );
    if (!originAssetHex) {
      throw new Error("originAssetHex is null");
    }
    setProgress(progress+8)
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
    setProgress(progress+8)
    const initialBalOnEth = await token.balanceOf(
      targetAddress
    );
    setProgress(progress+8)
    const initialBalOnEthFormatted = formatUnits(initialBalOnEth._hex, 9);
    console.log('balance before transfer', initialBalOnEthFormatted);

    // transfer the test token
    setProgress(progress+8)
    const amount = parseUnits("8437", 0).toBigInt();
    setProgress(progress+8)
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
      tryNativeToUint8Array('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', CHAIN_ID_ETH),
      2,
      undefined,
      parseUnits("0", 0).toBigInt()
    );
    setProgress(progress+8)
    const transaction = await promise;
    // console.log(
    //   connection,
    //   SOL_BRIDGE_ADDRESS,
    //   SOL_TOKEN_BRIDGE_ADDRESS,
    //   payerAddress,
    //   fromAddress,
    //   TEST_SOLANA_TOKEN,
    //   amount,
    //   tryNativeToUint8Array(targetAddress, CHAIN_ID_ETH),
    //   2,
    //   tryNativeToUint8Array('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', CHAIN_ID_ETH),
    //   2,
    //   undefined,
    //   parseUnits("0", 0).toBigInt()
    // );
    // sign, send, and confirm transaction
    setProgress(progress+8)
    const txid = await signSendAndConfirm(solanaWallet, connection, transaction);
    console.log('working');
    await connection.confirmTransaction(txid);
    setProgress(progress+8)
    const info = await connection.getTransaction(txid);
    if (!info) {
      throw new Error(
        "An error occurred while fetching the transaction info"
      );
    }
    // get the sequence from the logs (needed to fetch the vaa)
    setProgress(progress+8)
    const sequence = parseSequenceFromLogSolana(info);
    setProgress(progress+8)
    const emitterAddress = await getEmitterAddressSolana(
      SOL_TOKEN_BRIDGE_ADDRESS
    );
    // poll until the guardian(s) witness and sign the vaa
    setProgress(progress+8)
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
    // APPROVE
    await approveEth(
      '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9', //contract
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', //token
      signer, 
      1000000 // amount
    );
    // deposit function contract call
    setProgress(progress+8)
    const aave = new ethers.Contract("0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", abi, signer);
    console.log('working');
    setProgress(progress+8)
    const tx = await aave.deposit(targetAddress, 8239, targetAddress, 0, {
      gasLimit: 100000,
      nonce: undefined,
    });
    console.log('working');
    setProgress(progress+10)
    const rec = await tx.wait();
    console.log('working');
    console.log(rec);
    setProgress(100);
    setSpinnerLoading(false);
    setShowHideImage('flex');
    letToggle();

    
    
  };


  useEffect(() => {
    OnSubmit();
  }, [])

  const [spinnerLoading, setSpinnerLoading] = useState(true);
  const [show_Hide_Image, setShowHideImage] = useState("none");
  const [a, setA] = useState(false);
  const letToggle = () => {
    if (show_Hide_Image === "flex") {
      setA(true);
      setSpinnerLoading(true);
      setShowHideImage("none");
    } else {
      setShowHideImage("flex");
      setSpinnerLoading(false);
    }
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
                style={{ borderWidth: "2px" }}
                className={`indexedStep ${accomplished ? "accomplished" : null
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
                className={`indexedStep ${accomplished ? "accomplished" : null
                  }`}
              >
                {index + 1}
              </div>
              <div className={"test"}>Approve</div>
            </>
          )}
        </Step>
        <Step>
          {({ accomplished, index }) => (
            <>
              <div
                className={`indexedStep ${accomplished ? "accomplished" : null
                  }`}
              >
                {index + 1}
              </div>
              <div className={"test"}>Deposit</div>
            </>
          )}
        </Step>
        <Step>
          {({ accomplished, index }) => (
            <>
              <div
                className={`indexedStep ${accomplished ? "accomplished" : null
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
          View Transfer
        </Link>
        <center> <p style={{ color: "black", fontSize: "12px" }}>  {hash} </p></center>

        <Link
          className={a ? "viewOnXDCText" : "viewOnXDCTextDisable"}
          to={{
            pathname: "/courses",
            search: "?sort=name",
            hash: "#the-hash",
            state: { fromDashboard: true },
          }}  
        >
          View Receipt
        </Link>
        <center>  <p style={{ color: "black", fontSize: "12px" }}> {hasher} </p> </center>
      </div>
    </div>
  );
}