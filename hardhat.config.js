require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: 'https://eth-sepolia.g.alchemy.com/v2/lPmyUbpUF1muSEHWM3NW0Q-Str5WA0te',
        // blockNumber: 5732504
      }
    },
    localhost: {
      url: 'http://127.0.0.1:8545'
    },
    node1: {
      url: 'http://127.0.0.1:8545'
    },
    node2: {
      url: 'http://127.0.0.1:8546',
    }
  }
};
