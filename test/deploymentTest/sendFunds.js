const { ethers } = require("hardhat");
const colors = require("colors");

const gasPrice = ethers.parseUnits('40', 'gwei'); // 40 Gwei
const gasLimit = 21000; // Standard gas limit for ETH transfer

const targetAddress  = "0x66b7c72B60dE824658B4158A51575CB6e35C1441";


describe("Send Native Funds", function () {
    let deployer;
    this.timeout(60000); // 60 seconds

    before(async function () {
        [deployer] = await ethers.getSigners();
    });

    it("should check deployer balance", async function () {
        const balance = await deployer.getBalance();
        console.log(`Deployer balance: ${ethers.formatEther(balance)} ETH`);
    });

    it("should send native funds to target address", async function () {
        const amountToSend = ethers.parseUnits('0.1', 'ether'); // Amount to send in ETH

        console.log(`Sending ${ethers.formatEther(amountToSend)} ETH to ${targetAddress}...`);

        const tx = {
            to: targetAddress,
            value: amountToSend,
            gasPrice: gasPrice,
            gasLimit: gasLimit
        };

        const transaction = await deployer.sendTransaction(tx);
        const receipt = await transaction.wait();

        console.log(colors.green(`Transaction hash: ${receipt.transactionHash}`));
        console.log(colors.green(`Successfully sent ${ethers.formatEther(amountToSend)} ETH to ${targetAddress}`));
    });

    it("should check target address balance", async function () {
        const balance = await ethers.provider.getBalance(targetAddress);
        console.log(`Target address balance: ${ethers.formatEther(balance)} ETH`);
    });
});
