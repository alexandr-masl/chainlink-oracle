require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: {
    version: "0.8.19",
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
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/lPmyUbpUF1muSEHWM3NW0Q-Str5WA0te',
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
