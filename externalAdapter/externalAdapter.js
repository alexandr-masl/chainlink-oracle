const express = require('express');
const bodyParser = require('body-parser');
const colors = require("colors");
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = 8080; // Set the port directly

// Handle GET requests at the root path
app.get('/data/price', async (req, res) => {
    try {
        
        console.log('Received data:', req.body);

        const simulatedResponse = { USD: 777 };

        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ::::NEW REQUEST OF: /data/price`);

        res.status(200).json(simulatedResponse);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            status: 'errored',
            error: error.message,
        });
    }
});


app.post('/data/log', async(req, res) => {
    try {

        const timestamp = new Date().toISOString();
        console.log(colors.green(`\n\n\n${timestamp}] :::Received data:`));

        const data = req.body;
        console.log(data);

        const coin = (data.coin).toUpperCase();
        console.log(colors.white(`:::::::::Coin: ${coin}`))

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

app.listen(PORT, () => {
    console.log(colors.yellow(`:::::::External Adapter listening on port ${PORT}`));
});
