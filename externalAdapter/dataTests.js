const { ethers } = require('hardhat');
const colors = require('colors');

const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';
const ETH_RPC_URL = 'https://eth-mainnet.g.alchemy.com/v2/lPmyUbpUF1muSEHWM3NW0Q-Str5WA0te';

// Chainlink BNB/USDT Price Feed contract
const CHAINLINK_BNB_USDT_ADDRESS_BSC = '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE'; // BSC example
const CHAINLINK_BNB_USDT_ADDRESS_ETH = '0x14e613AC84a31f709eadbdF89C6CC390fDc9540A'; // BSC example

const PRICE_FEED_ABI = [
  {
    "inputs": [],
    "name": "latestAnswer",
    "outputs": [
      { "internalType": "int256", "name": "", "type": "int256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function fetchChainlinkPrice(rpcUrl, contractAddress) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const priceFeed = new ethers.Contract(contractAddress, PRICE_FEED_ABI, provider);

  const price = await priceFeed.latestAnswer();
  return (price);
}

async function main() {
  // Fetch BNB/USDT price on BSC
  const bnbPriceBsc = await fetchChainlinkPrice(BSC_RPC_URL, CHAINLINK_BNB_USDT_ADDRESS_BSC);
  console.log(colors.green(`BNB/USDT price on BSC:`), bnbPriceBsc);

  const bnbPriceEth = await fetchChainlinkPrice(ETH_RPC_URL, CHAINLINK_BNB_USDT_ADDRESS_ETH);
  console.log(colors.green(`BNB/USDT price on Ethereum:`), bnbPriceEth);
}

main();
