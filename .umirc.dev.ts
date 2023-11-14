import { defineConfig } from "umi";

console.log('dev')

export default defineConfig({
  base: '/',
  define: { 
    
    WS_URL: 'ws://dev.binax.geagle.top/ws',
    OPTIONS_ADDRESS: '0x8222d6C42BE2FF6159267776719F1E7D5baD34dC',
    UTB_ADDRESS: "0xe9987552C06FB69a78bFA63c5C121E1d6BA6Ac46",
    WETH_ADDRESS: "0x7F5bc2250ea57d8ca932898297b1FF9aE1a04999",
    USDT_ADDRESS: "0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892",
    APOLLO_CLIENT_URI: "https://api.thegraph.com/subgraphs/name/bgcmdev/binax",
    CHAIN_ID: 421613,
    DESIRED_CHAINID: '0x66eed',
    // https://cloud.walletconnect.com/sign-in
    WALLETCONNECT_PROJECTID: 'eeaf2ca59fe97674186a70cdbdc1ed3b',
    /* OPTIONS_ADDRESS: '0x0784bcA94eB929Df6e53210e1ec4Fd88dE75393D',
    UTB_ADDRESS: "0x5C1d3d1FD2Da539eb6c8301206A6d86100619279",
    WETH_ADDRESS: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    USDT_ADDRESS: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    APOLLO_CLIENT_URI: "https://api.thegraph.com/subgraphs/name/binaxdeveloper/binaxprotocol",
    CHAIN_ID: 42161,
    DESIRED_CHAINID: '0xa4b1', */
  },
  proxy: {
    '/apioption': {
      target: 'http://dev.binax.geagle.top', // 测试环境
      // target: 'https://www.mini-fi.com', // 正式
      changeOrigin: true,
      ws: true,
      pathRewrite: {
          // '^/apioption': ''
      }
    },
    /* '/api/order/': {
      target: ' http://192.168.101.6:8548', // 测试
      // target: 'https://www.mini-fi.com', // 正式
      changeOrigin: true,
      ws: false,
      pathRewrite: {
          '^/api/order/': '/order/'
      }
    }, */
    '/api/': {
      target: 'http://dev.binax.geagle.top', // 测试
      // target: 'https://www.mini-fi.com', // 正式
      changeOrigin: true,
      ws: false,
      pathRewrite: {
          // '^/api/': '/'
      }
    },
  },
})