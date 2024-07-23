const { ethers } = require("hardhat");
const {LINK_address, operatorAddress, REQUEST_CROSS_CHAIN_COIN_PRICE_JOB, REQUEST_COIN_PRICE_JOB} = require("../settings.json");
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

    const txSetJobIDToRequestType = await highLevelOracle.setJobIDToRequestType(REQUEST_COIN_PRICE_JOB, 1, { gasPrice, gasLimit });
    await txSetJobIDToRequestType.wait();

    console.log(colors.green(`set REQUEST_COIN_PRICE_JOB()`));
    // console.log(receipt);

    const txSetJobIDToRequestType_CrossChainPrice = await highLevelOracle.setJobIDToRequestType(REQUEST_CROSS_CHAIN_COIN_PRICE_JOB, 2, { gasPrice, gasLimit });
    await txSetJobIDToRequestType_CrossChainPrice.wait();

    console.log(colors.green(`set REQUEST_CROSS_CHAIN_COIN_PRICE_JOB()`));
}

// Execute the deployment script
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
