import { defineConfig } from "umi";

console.log("prod")
export default defineConfig({
  base: '/',
  publicPath: '/',
  define: { 
    WS_URL: '/ws',
    OPTIONS_ADDRESS: '0x0784bcA94eB929Df6e53210e1ec4Fd88dE75393D',
    UTB_ADDRESS: "0x5C1d3d1FD2Da539eb6c8301206A6d86100619279",
    WETH_ADDRESS: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    USDT_ADDRESS: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    APOLLO_CLIENT_URI: "https://api.thegraph.com/subgraphs/name/binaxdeveloper/binaxprotocol",
    CHAIN_ID: 42161,
    DESIRED_CHAINID: "0xa4b1",
    // https://cloud.walletconnect.com/sign-in
    WALLETCONNECT_PROJECTID: 'eeaf2ca59fe97674186a70cdbdc1ed3b',
  },
});
