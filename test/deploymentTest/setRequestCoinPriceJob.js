const { ethers } = require("hardhat");
const fs = require('fs');
const highLevelOracleAbi = JSON.parse(fs.readFileSync('./artifacts/contracts/HighLevelOracle.sol/HighLevelOracle.json')).abi;
const { highLevelOracleAddress, REQUEST_COIN_PRICE_JOB} = require('../../settings.json')
const colors = require("colors");

const gasPrice = ethers.parseUnits('40', 'gwei'); // 40 Gwei
const gasLimit = 500000; // Set the gas limit to a higher value

describe("Token Balance Check", function () {
    let provider, deployer, highLevelOracle;
    this.timeout(60000); // 60 seconds

    before(async function () {
        [deployer] = await ethers.getSigners();
        provider = deployer.provider;

        highLevelOracle = new ethers.Contract(highLevelOracleAddress, highLevelOracleAbi, deployer);
    });

    it("should check HighLevelOracle", async function () {
        console.log(`HighLevelOracle at: ${highLevelOracle.target}`);
    });

    it("should call requestEthereumPrice of HighLevelOracleBalance", async function () {

        const txSetRequestCoinPriceJob = await highLevelOracle.setMethodJobID(REQUEST_COIN_PRICE_JOB, "requestCoinPrice", {gasPrice, gasLimit});
        const receiptSetRequestCoinPriceJob = await txSetRequestCoinPriceJob.wait();

        console.log(colors.green(`setMethodJobID()`));
    });
})
