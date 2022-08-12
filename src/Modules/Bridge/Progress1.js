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
import { 
  SOLANA_HOST,
  ETH_TOKEN_BRIDGE_ADDRESS,
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
  WORMHOLE_RPC_HOSTS,
  ETH_BRIDGE_ADDRESS
 } from "../../utils/consts"
import { postVaaWithRetry } from "../../utils/postVaa";
 const { ethers } = require("ethers");
import abi from "../../contracts/aave.json";
import { TxFailed } from "@terra-money/wallet-provider";


export default function App() {
  const [hash, setHash] = useState("Click on confirm button to start transaction, All the Best");
  const [hasher, setHasher] = useState("");
  const solanaWallet = useSolanaWallet();
  let solAddress;



  const OnSubmit = async () => {
    
    setHash("Nice Click");
    try { 
    
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
        setHash(solAddress + ' will send from');
        console.log(solAddress, 'add', resp.publicKey.toString());
        // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo 
    } catch (err) {
        console.log(err.message)
    }
    // // create a signer for Eth
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Target Address:", await signer.getAddress());
    const targetAddress = await signer.getAddress();
    setHash("metamask wallet "+ targetAddress);
    // // create a keypair for Solana]
    const payerAddress = solAddress.toString();
    // find the associated token account
    const solanaMintKey1 = new PublicKey(
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
        solanaMintKey1,
        new PublicKey(solAddress)
      )
    ).toString();
    console.log('From Address:', fromAddress);
    setHash("initialising solana txn");

    // Get the initial solana token balance
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

    // // transfer the test token
    const amount = parseUnits("1000000", 0).toBigInt();
    const promise1 = transferFromSolana(
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
    setHash("Kindly Approve txn on your connected wallet");
    const transaction1 = await promise1;
    // sign, send, and confirm transaction
    const txid1 = await signSendAndConfirm(solanaWallet, connection, transaction1);
    console.log('working');
    await connection.confirmTransaction(txid1);
    const info1 = await connection.getTransaction(txid1);
    if (!info1) {
      throw new Error(
        "An error occurred while fetching the transaction info"
      );
    }
    // get the sequence from the logs (needed to fetch the vaa)
    const sequence1 = parseSequenceFromLogSolana(info);
    const emitterAddress1 = await getEmitterAddressSolana(
      SOL_TOKEN_BRIDGE_ADDRESS
    );
    setHash("Calling for signatures from Oracles");
    // poll until the guardian(s) witness and sign the vaa
    const { vaaBytes: signedVAA1 } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_SOLANA,
      emitterAddress1,
      sequence1,
      {
        transport: NodeHttpTransport(),
      }
    );
    setHash("Confirm transaction on Metamask");
    await redeemOnEth(ETH_TOKEN_BRIDGE_ADDRESS, signer, signedVAA1); 
    // APPROVE
    setHash("kindly approve and confirm AAVE2.0 Txn");
    await approveEth(
      '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9', //contract
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', //token
      signer, 
      parseUnits("1500000", 0).toBigInt() // amount
    );
    // deposit function contract call
    const aave = new ethers.Contract("0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", abi, signer);
    console.log('working', targetAddress);
    const tx = await aave.deposit('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 1000000, targetAddress, 0);
    console.log('working');
    const rec = await tx.wait();
    console.log('working');
    console.log(rec);
    const solanaMintKey = new PublicKey(
      (await getForeignAssetSolana(
        connection,
        SOL_TOKEN_BRIDGE_ADDRESS,
        CHAIN_ID_ETH,
        hexToUint8Array(nativeToHexString('0xBcca60bB61934080951369a648Fb03DF4F96263C', CHAIN_ID_ETH) || "")
      )) || ""
    );
    console.log('working');
    const recipientAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      solanaMintKey,
      new PublicKey(solAddress)
    );
    console.log("working2");
    await approveEth(
      ETH_TOKEN_BRIDGE_ADDRESS, //contract
      '0xbcca60bb61934080951369a648fb03df4f96263c', //token
      signer, 
      parseUnits("1500000", 0).toBigInt() // amount
    );
    console.log("working4");
    const receipt = await transferFromEth(
      ETH_TOKEN_BRIDGE_ADDRESS,
      signer,
      '0xbcca60bb61934080951369a648fb03df4f96263c',
      amount, // big numbers
      CHAIN_ID_SOLANA,
      tryNativeToUint8Array(recipientAddress, CHAIN_ID_SOLANA)
    );
    console.log("working 3");
    // Get the sequence number and emitter address required to fetch the signedVAA of our message
    const sequence = parseSequenceFromLogEth(receipt, ETH_BRIDGE_ADDRESS);
    console.log('working 5');
    const emitterAddress = getEmitterAddressEth(ETH_TOKEN_BRIDGE_ADDRESS);
    console.log('working 6');
    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_ETH,
      emitterAddress,
      sequence,
      {
        transport: NodeHttpTransport(),
      }
    );
    
    // let vaa = [1,0,0,0,2,13,0,175,155,185,116,20,176,243,121,229,137,29,57,20,103,49,53,59,223,105,132,27,121,239,184,164,67,82,173,111,130,52,117,50,110,5,31,238,46,163,85,184,171,220,246,227,45,207,219,124,144,203,239,169,186,200,117,135,222,191,217,120,68,59,233,1,2,156,147,169,112,246,233,161,1,10,112,173,95,155,218,149,29,176,21,175,24,39,21,18,127,104,33,137,240,47,113,204,191,69,228,119,167,246,130,150,97,2,187,211,252,210,76,37,162,132,234,22,106,217,80,143,229,100,65,5,182,115,4,208,178,0,3,132,186,13,136,225,129,46,193,202,114,24,46,17,50,156,223,99,221,20,235,2,70,184,31,128,54,226,149,19,133,53,204,64,23,31,109,75,76,206,126,134,46,34,132,201,48,131,201,50,11,243,153,200,234,69,153,67,170,54,148,35,17,214,224,0,4,174,235,63,147,201,224,114,122,74,141,190,247,139,85,87,178,252,4,168,57,52,31,245,149,247,64,43,83,237,116,61,210,77,33,143,137,146,215,99,123,74,168,255,153,136,82,141,1,14,105,216,41,160,24,191,40,172,235,5,243,160,122,27,129,0,6,121,10,56,16,234,108,200,64,219,71,208,75,196,14,173,160,130,230,188,87,212,15,64,167,31,174,195,162,207,106,95,18,70,64,210,47,141,244,83,28,131,154,26,248,82,224,181,125,202,151,29,105,88,124,212,139,8,35,228,244,240,232,40,122,0,10,189,3,13,235,5,248,129,164,175,143,69,49,106,238,6,50,69,66,58,83,29,108,60,103,14,167,119,211,251,253,66,98,102,100,229,144,107,162,96,96,4,97,135,62,141,12,14,155,24,97,156,98,211,183,209,180,129,176,58,96,107,58,10,196,0,11,202,210,65,206,90,165,203,45,154,71,88,54,29,227,224,190,95,70,16,186,88,212,17,254,211,161,113,255,21,213,139,217,43,67,56,68,228,157,225,14,115,125,139,189,149,116,240,105,133,246,175,102,192,90,186,171,219,209,152,55,251,81,73,214,0,12,232,75,151,177,252,84,127,66,116,119,49,83,54,220,18,17,232,179,42,212,8,103,101,96,214,166,47,158,116,77,225,65,107,38,211,141,196,208,24,7,196,158,120,83,48,238,239,14,154,186,24,49,102,138,188,50,227,55,242,114,168,53,149,119,0,13,173,186,186,243,219,12,229,161,243,21,101,117,245,89,217,38,31,187,114,236,62,68,75,103,2,243,196,249,224,195,164,19,18,6,82,213,169,246,155,141,7,26,50,125,195,239,228,179,50,158,40,167,58,167,49,181,193,192,116,144,90,167,74,48,1,15,68,243,155,118,240,4,108,43,80,41,109,70,111,191,237,251,123,65,101,31,59,40,201,78,230,35,152,213,155,88,167,250,97,132,111,23,80,240,2,97,58,88,205,10,105,104,58,27,0,213,123,251,111,63,232,15,55,110,31,116,182,53,62,92,1,16,46,165,218,18,29,19,143,125,59,51,66,211,216,52,247,53,245,212,148,8,165,185,144,245,180,203,28,200,122,235,172,146,11,178,93,64,234,180,229,89,118,59,111,8,4,189,5,229,125,18,245,50,238,191,51,8,224,217,24,21,36,215,171,98,1,17,56,110,79,31,27,150,94,243,213,33,81,59,245,225,11,72,37,125,100,173,112,131,117,237,212,117,68,128,164,210,182,169,27,172,19,116,115,106,229,252,187,252,107,76,151,143,246,164,16,75,203,60,164,115,232,139,93,63,170,173,230,5,51,152,1,18,79,171,89,30,169,41,192,121,201,54,217,30,77,68,116,126,76,80,179,80,85,126,180,196,32,70,122,147,167,152,26,111,70,143,36,216,161,121,113,120,18,88,118,40,243,188,133,239,213,69,147,13,102,53,143,58,106,126,36,71,231,41,107,67,0,98,246,33,141,203,129,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,62,225,139,34,20,175,249,112,0,217,116,207,100,126,124,52,126,143,165,133,0,0,0,0,0,1,47,9,15,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,66,64,0,0,0,0,0,0,0,0,0,0,0,0,188,202,96,187,97,147,64,128,149,19,105,166,72,251,3,223,79,150,38,60,0,2,84,75,164,64,20,45,47,160,49,244,87,97,20,135,140,215,7,78,49,203,3,114,112,177,24,79,171,73,206,11,166,127,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    // const svaa = new Uint8Array(vaa)
    // console.log(svaa, 'wwwf');
    const promise = redeemOnSolana(
      connection,
      SOL_BRIDGE_ADDRESS,
      SOL_TOKEN_BRIDGE_ADDRESS,
      payerAddress,
      signedVAA
    );
    console.log(connection,
      SOL_BRIDGE_ADDRESS,
      SOL_TOKEN_BRIDGE_ADDRESS,
      payerAddress,
      signedVAA)
    await postVaaWithRetry(
      connection,
      solanaWallet.signTransaction,
      SOL_BRIDGE_ADDRESS,
      payerAddress,
      Buffer.from(signedVAA),
      1000
    );
    console.log(promise);
    const transaction = await promise;
    console.log('transaction', transaction);
    const txid = await signSendAndConfirm(solanaWallet, connection, transaction);
    console.log('w2')
    await connection.confirmTransaction(txid);
    const info = await connection.getTransaction(txid);
    if (!info) {
      throw new Error(
        "An error occurred while fetching the transaction info"
      );
    }
    setHash('Transaction Done!')
    setHasher(txid)
    } catch (err) {
      setHash(err.message+' txn failed kindly resolve error and try again!');
      console.log(err)
    }
  };

  return (
      <div className="done" style={{alignItems: 'left'}}>
        <div style={{ justifyContent: "space-between", margin: '30px' }}>
          <button className="confirm-button" onClick={OnSubmit}>
            Confirm
          </button>
        </div>
        <div style={{ color: "black", fontSize: "1.2rem", textAlign: 'left', width: "-webkit-fill-available" }} class="loader">
          Notes: {hash}
          <span class="loader__dot">.</span>
          <span class="loader__dot">.</span>
          <span class="loader__dot">.</span>
        </div>
        <p> {hasher} </p>
      </div>
  );
}