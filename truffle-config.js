const HDWalletProvider = require('@truffle/hdwallet-provider');
const path = require('path');
require('dotenv').config();

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    rinkeby: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: process.env.MNEMONIC
          },
          providerOrUrl: process.env.RINKEBY_RPC_URL,
          numberOfAddresses: 1,
          shareNonce: true,
        }),
      network_id: '4',
    }
  },
  compilers: {
    solc: {
      version: '0.6.6'
    },
  },
  api_keys : {
    etherscan: process.env.ETHERSCAN_API_KEY
  },
  plugins: [
    'truffle-plugin-verify'
  ]
}