const { ethers } = require("hardhat");

async function main() {
    const gasPrice = ethers.parseUnits('40', 'gwei'); // 40 Gwei

    // Get the contract factory for HighLevelOracle
    const HighLevelOracle = await ethers.getContractFactory("HighLevelOracle");

    // Deploy the contract
    const highLevelOracle = await HighLevelOracle.deploy({ gasPrice });

    console.log(`HighLevelOracle deployed at: ${highLevelOracle.target}`);
}

// Execute the deployment script
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
