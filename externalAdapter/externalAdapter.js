const express = require('express');
const { ethers } = require('hardhat');
const bodyParser = require('body-parser');
const colors = require("colors");
const axios = require('axios');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
const PORT = 8080;


app.post('/data/log', async(req, res) => {
    try {

        const timestamp = new Date().toISOString();
        console.log(colors.green(`\n\n\n${timestamp}] :::Received data:`));

        const data = req.body;
        console.log(data);

        try{
            const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD`;
            console.log(colors.white(`:::::::::URL: ${apiUrl}`))

            const response = await axios.get(apiUrl);

            console.log(colors.green(`${timestamp}] :::Received response:`));
            console.log(response.data)

            res.status(200).json(response.data);
        }
        catch(err){
            res.status(500).json({
                status: 'errored',
                error: 'Error fetching data from external API',
                details: err.message,
            });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            status: 'errored',
            error: error.message,
        });
    }
});

app.post('/data/crossChainPrice', async(req, res) => {
    try {

        const timestamp = new Date().toISOString();
        console.log(colors.green(`\n\n\n${timestamp}] :::Received data for /data/crossChainPrice:`));

        const data = req.body;
        console.log(data);

        const PRICE_FEED_ABI = [
            {
                "inputs": [],
                "name": "latestAnswer",
                "outputs": [
                { "internalType": "int256", "name": "", "type": "int256" }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        async function fetchChainlinkPrice(rpcUrl, contractAddress) {
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const priceFeed = new ethers.Contract(contractAddress, PRICE_FEED_ABI, provider);
            const price = await priceFeed.latestAnswer();
            return Number(price);
        }

        async function getChainId(rpcUrl) {
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const network = await provider.getNetwork();
            return Number(network.chainId);
        }

        const priceArray = Array(3).fill(0);
        const chainArray = Array(3).fill(0);

        try{

            const chain1Contract = data.chain1Contract;
            const chain1RPC = data.chain1RPC;

            if (chain1Contract.length && chain1RPC.length){
                priceArray[0] = await fetchChainlinkPrice(chain1RPC, chain1Contract);
                chainArray[0] = await getChainId(chain1RPC);
                // console.log(colors.green(`:::Chain 1 price:`), priceArray[0]);
                // console.log(colors.green(`:::Chain 1 ID:`), chainArray[0]);
            }

            const chain2Contract = data.chain2Contract;
            const chain2RPC = data.chain2RPC;

            if (chain2Contract.length && chain2RPC.length){
                priceArray[1] = await fetchChainlinkPrice(chain2RPC, chain2Contract);
                chainArray[1] = await getChainId(chain2RPC);
                // console.log(colors.green(`:::Chain 2 price:`), priceArray[1]);
                // console.log(colors.green(`:::Chain 2 ID:`), chainArray[1]);
            }

            const chain3Contract = data.chain3Contract;
            const chain3RPC = data.chain3RPC;

            if (chain3Contract.length && chain3RPC.length){
                priceArray[2] = await fetchChainlinkPrice(chain3RPC, chain3Contract);
                chainArray[2] = await getChainId(chain3RPC);
                // console.log(colors.green(`:::Chain 2 price:`), priceArray[2]);
                // console.log(colors.green(`:::Chain 2 ID:`), chainArray[2]);
            }

            console.log(colors.white(":::::Prices Array"))
            console.log(priceArray)

            console.log(colors.white(":::::Chains Array"))
            console.log(chainArray)

            const resultingData = {
                priceArray: priceArray,
                chainArray: chainArray
            }

            res.status(200).json(resultingData);
        }
        catch(err){
            console.log(colors.red("******* crossChainPrice ERROR"))
            console.log(err)

            res.status(500).json({
                status: 'errored',
                error: 'Error fetching data from external API',
                details: err.message,
            });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            status: 'errored',
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(colors.yellow(`:::::::External Adapter listening on port ${PORT}`));
});
