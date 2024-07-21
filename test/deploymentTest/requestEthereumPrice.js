const { ethers } = require("hardhat");
const fs = require('fs');
const highLevelOracleAbi = JSON.parse(fs.readFileSync('./artifacts/contracts/HighLevelOracle.sol/HighLevelOracle.json')).abi;
const LINK_address = '0x779877A7B0D9E8603169DdbD7836e478b4624789';
const OWNER = "0x01Ae8d6d0F137CF946e354eA707B698E8CaE6485";
const JOB_ID = "9be9621412324b5e82e6a0250d0f9efd"; // Replace with your Job ID
const ORACLE_PAYMENT = ethers.parseUnits("1", 18); // Replace with your payment amount (in LINK)
const highLevelOracleAddress = "0x1EEF12e36919DC318681f051F9528253cD67674A"; 
const operatorAddress = "0x0E9F7697bdd7D16268De7a882A377A0aFEC50Cff"; 


describe("Token Balance Check", function () {
    let provider, deployer, LINK, highLevelOracle;
    this.timeout(60000); // 60 seconds

    before(async function () {
        [deployer] = await ethers.getSigners();
        provider = deployer.provider;

        LINK = await ethers.getContractAt([
            "function deposit() payable",
            "function balanceOf(address) view returns (uint256)",
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function allowance(address owner, address spender) view returns (uint256)",
            "function transfer(address recipient, uint256 amount) external returns (bool)"
        ], LINK_address);

        highLevelOracle = new ethers.Contract(highLevelOracleAddress, highLevelOracleAbi, deployer);
    });

    it("should check HighLevelOracle", async function () {
        console.log(`HighLevelOracle at: ${highLevelOracle.target}`);
    });

    it("should get LINK balance of wallet", async function () {
        const balance = await LINK.balanceOf(OWNER);
        console.log(`Deployer LINK Balance: ${ethers.formatUnits(balance, 18)}`);

        // await LINK.connect(deployer).transfer(highLevelOracle.target, ORACLE_PAYMENT);

        const highLevelOracleBalance = await LINK.balanceOf(highLevelOracle.target);
        console.log(`HighLevelOracleBalance LINK Balance: ${ethers.formatUnits(highLevelOracleBalance, 18)}`);
    });

    it("should call requestEthereumPrice of HighLevelOracleBalance", async function () {
        // Call the requestEthereumPrice function
        const tx = await highLevelOracle.requestEthereumPrice(operatorAddress, JOB_ID);
        const receipt = await tx.wait();

        console.log("Requested Ethereum price from Oracle");

        console.log("----- FULL EVENT LOG ------")
        console.log(receipt.events)

        const event = receipt.events.find(event => event.event === "EthereumPriceRequested");
        const requestId = event.args[0];

        // Log the requestId
        console.log(`Request ID: ${requestId}`);
    });
})
