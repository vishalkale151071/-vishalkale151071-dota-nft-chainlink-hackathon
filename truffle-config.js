const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
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