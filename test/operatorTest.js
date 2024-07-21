const { ethers } = require("hardhat");

const LINK_address = '0x779877A7B0D9E8603169DdbD7836e478b4624789';
const OWNER = "0x01Ae8d6d0F137CF946e354eA707B698E8CaE6485";
const JOB_ID = "b1d42cd54a3a4200b1f725a68e48aad8"; // Replace with your Job ID
const ORACLE_PAYMENT = ethers.parseUnits("1", 18); // Replace with your payment amount (in LINK)

describe("Token Balance Check", function () {
    let wallet, provider, deployer, LINK, operator, highLevelOracle;

    const localNet_Acc_1_Key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

    before(async function () {
        [deployer] = await ethers.getSigners();
        provider = deployer.provider;
        wallet = new ethers.Wallet(localNet_Acc_1_Key, provider);

        LINK = await ethers.getContractAt([
            "function deposit() payable",
            "function balanceOf(address) view returns (uint256)",
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function allowance(address owner, address spender) view returns (uint256)",
            "function transfer(address recipient, uint256 amount) external returns (bool)"
        ], LINK_address);
    });

    it("should get LINK balance of wallet", async function () {
        const balance = await LINK.balanceOf(OWNER);
        console.log(`LINK Balance: ${ethers.formatUnits(balance, 18)}`);
    });

    it("should deploy Operator", async function () {
        const Operator = await ethers.getContractFactory("Operator");
        const gasPrice = ethers.parseUnits('40', 'gwei'); // 40 Gwei

        operator = await Operator.deploy(LINK_address, OWNER, {
            gasPrice: gasPrice
        });

        console.log(`Operator deployed at: ${operator.target}`);
    });

    it("should deploy HighLevelOracle", async function () {
        const HighLevelOracle = await ethers.getContractFactory("HighLevelOracle");
        const gasPrice = ethers.parseUnits('40', 'gwei'); // 40 Gwei

        highLevelOracle = await HighLevelOracle.deploy({
            gasPrice: gasPrice
        });

        console.log(`highLevelOracle deployed at: ${highLevelOracle.target}`);
    });

    it("should request Ethereum price", async function () {

        await LINK.connect(wallet).transfer(highLevelOracle.target, ORACLE_PAYMENT);

        const tx = await highLevelOracle.requestEthereumPrice(operator.target, JOB_ID);
        await tx.wait();

        console.log("Requested Ethereum price from Chainlink Oracle");
    });

    it("should get Last Ethereum price", async function () {

        const lastEthereum = await highLevelOracle.currentPrice();

        console.log("Last Ethereum price from highLevelOracle");
        console.log(lastEthereum)
    });
});
