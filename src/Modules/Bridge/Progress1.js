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
 const { ethers } = require("ethers");
import abi from "../../contracts/aave.json";


export default function App() {
  const [hash, setHash] = useState("Click on confirm button to start transaction, All the Best");
  const [hasher, setHasher] = useState("");
  const solanaWallet = useSolanaWallet();
  let solAddress;



  const OnSubmit = async () => {
    
    setHash("Nice Click");
    
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
    // // create a signer for Eth
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Target Address:", await signer.getAddress());
    const targetAddress = await signer.getAddress();
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
    const amount = parseUnits("8437", 0).toBigInt();
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
    const transaction1 = await promise;
    // sign, send, and confirm transaction
    const txid1 = await signSendAndConfirm(solanaWallet, connection, transaction1);
    console.log('working');
    await connection.confirmTransaction(txid1);
    const info = await connection.getTransaction(txid1);
    if (!info) {
      throw new Error(
        "An error occurred while fetching the transaction info"
      );
    }
    // get the sequence from the logs (needed to fetch the vaa)
    const sequence1 = parseSequenceFromLogSolana(info);
    const emitterAddress1 = await getEmitterAddressSolana(
      SOL_TOKEN_BRIDGE_ADDRESS
    );
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
    await redeemOnEth(ETH_TOKEN_BRIDGE_ADDRESS, signer, signedVAA1);
    // APPROVE
    await approveEth(
      '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9', //contract
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', //token
      signer, 
      amount // amount
    );
    // deposit function contract call
    const aave = new ethers.Contract("0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", abi, signer);
    console.log('working');
    const tx = await aave.deposit(targetAddress, amount, targetAddress, 0, {
      gasLimit: 100000,
      nonce: undefined,
    });
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
    console.log("working");
    await approveEth(
      ETH_TOKEN_BRIDGE_ADDRESS, //contract
      '0xbcca60bb61934080951369a648fb03df4f96263c', //token
      signer, 
      amount // amount
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
    const emitterAddress = getEmitterAddressEth(ETH_TOKEN_BRIDGE_ADDRESS);
    const { signedVAA } = await getSignedVAA(
      WORMHOLE_RPC_HOSTS,
      CHAIN_ID_ETH,
      emitterAddress,
      sequence
    );
    const transaction = await redeemOnSolana(
      connection,
      SOL_BRIDGE_ADDRESS,
      SOL_TOKEN_BRIDGE_ADDRESS,
      targetAddress,
      signedVAA
    );
    const signed = await wallet.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);
  };

  return (
      <div className="done" style={{alignItems: 'left'}}>
        <div style={{ justifyContent: "space-between", margin: '30px' }}>
          <button className="confirm-button" onClick={OnSubmit}>
            Confirm
          </button>
        </div>
        <div style={{ color: "black", fontSize: "1.2rem", textAlign: 'left' }} class="loader">
          Notes: {hash}
          <span class="loader__dot">.</span>
          <span class="loader__dot">.</span>
          <span class="loader__dot">.</span>
        </div>
        <p> {hasher} </p>
      </div>
  );
}