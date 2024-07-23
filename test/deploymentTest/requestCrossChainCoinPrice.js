const { ethers } = require("hardhat");
const fs = require('fs');
const highLevelOracleAbi = JSON.parse(fs.readFileSync('./artifacts/contracts/HighLevelOracle.sol/HighLevelOracle.json')).abi;
const {LINK_address, highLevelOracleAddress} = require('../../settings.json')
const ORACLE_PAYMENT = ethers.parseUnits("1", 18); // Replace with your payment amount (in LINK)


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

    it("should approve LINK tokens for HighLevelOracle contract", async function () {
        // Approve the HighLevelOracle contract to spend LINK tokens
        const tx = await LINK.connect(deployer).approve(highLevelOracle.target, ORACLE_PAYMENT);
        await tx.wait();
        console.log(`Approved HighLevelOracle to spend ${ethers.formatUnits(ORACLE_PAYMENT, 18)} LINK tokens`);
    });

    it("should call requestCrossChainCoinPrice", async function () {

        // Define the cross-chain price request
        const crossChainPriceRequest = [
            { 
                rpcUrl: "https://bsc-dataseed.binance.org/", priceFeedContract:"0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE" 
            },
            { 
                rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/lPmyUbpUF1muSEHWM3NW0Q-Str5WA0te", 
                priceFeedContract: "0x14e613AC84a31f709eadbdF89C6CC390fDc9540A" 
            },
            { 
                rpcUrl: "", 
                priceFeedContract: "" 
            }
        ];

        // Call the requestCrossChainCoinPrice function
        const tx = await highLevelOracle.requestCrossChainCoinPrice(crossChainPriceRequest);
        const receipt = await tx.wait();
        console.log("Requested Cross Chain Coin Price price from Oracle");
    });
})
