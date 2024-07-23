const { ethers } = require("hardhat");
const fs = require('fs');
const highLevelOracleAbi = JSON.parse(fs.readFileSync('./artifacts/contracts/PriceOracle.sol/PriceOracle.json')).abi;
const { oracleAddress, REQUEST_COIN_PRICE_JOB} = require('../../settings.json')
const colors = require("colors");

const gasPrice = ethers.parseUnits('40', 'gwei'); // 40 Gwei
const gasLimit = 500000; // Set the gas limit to a higher value

describe("Token Balance Check", function () {
    let provider, deployer, oracle;
    this.timeout(60000); // 60 seconds

    before(async function () {
        [deployer] = await ethers.getSigners();
        provider = deployer.provider;

        oracle = new ethers.Contract(oracleAddress, highLevelOracleAbi, deployer);
    });

    it("should check PriceOracle", async function () {
        console.log(`PriceOracle at: ${oracle.target}`);
    });

    it("should call requestEthereumPrice of HighLevelOracleBalance", async function () {

        const txSetJobIDToRequestType = await oracle.setJobIDToRequestType(REQUEST_COIN_PRICE_JOB, 1, { gasPrice, gasLimit });
        await txSetJobIDToRequestType.wait();

        console.log(colors.green(`setJobIDToRequestType()`));
    });
})
