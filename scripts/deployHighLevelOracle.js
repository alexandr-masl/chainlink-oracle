const { ethers } = require("hardhat");
const {LINK_address, operatorAddress, JOB_ID, REQUEST_COIN_PRICE_JOB} = require("../settings.json");
const colors = require("colors");

async function main() {
    const gasPrice = ethers.parseUnits('40', 'gwei'); // 40 Gwei
    const gasLimit = 500000; // Set the gas limit to a higher value

    // Get the contract factory for HighLevelOracle
    const HighLevelOracle = await ethers.getContractFactory("HighLevelOracle");

    console.log(colors.green(":::Deploying.."))

    // Deploy the contract
    const highLevelOracle = await HighLevelOracle.deploy(LINK_address, operatorAddress, { gasPrice });

    console.log(colors.white(`:::HighLevelOracle deployed at: ${highLevelOracle.target}`));

    const tx = await highLevelOracle.setRequestEthereumPriceJob(JOB_ID, { gasPrice, gasLimit });
    const receipt = await tx.wait();

    console.log(colors.green(`setRequestEthereumPrice()`));
    // console.log(receipt);

    const txSetRequestCoinPriceJob = await highLevelOracle.setRequestCoinPriceJob(REQUEST_COIN_PRICE_JOB, { gasPrice, gasLimit });
    const receiptSetRequestCoinPriceJob = await txSetRequestCoinPriceJob.wait();

    console.log(colors.green(`setRequestCoinPriceJob()`));
    // console.log(receipt);
}

// Execute the deployment script
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
