const { ethers } = require("hardhat");

async function main() {
    const LINK_address = '0x779877A7B0D9E8603169DdbD7836e478b4624789';
    const OWNER = "0x01Ae8d6d0F137CF946e354eA707B698E8CaE6485";
    const gasPrice = ethers.parseUnits('40', 'gwei'); // 40 Gwei

    // Get the contract factory for Operator
    const Operator = await ethers.getContractFactory("Operator");

    // Deploy the contract
    const operator = await Operator.deploy(LINK_address, OWNER, { gasPrice });

    console.log(`Operator deployed at: ${operator.target}`);
}

// Execute the deployment script
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});
