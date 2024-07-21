const express = require('express');
const bodyParser = require('body-parser');
const colors = require("colors");
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


app.post('/data/log', (req, res) => {
    try {

        console.log('Received data:', req.body);

        const simulatedResponse = { USD: 777 };

        console.log(`:::: REQUEST query`);
        console.log(req.query)

        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] :::: NEW REQUEST FOR: /data/coinPrice`);

        res.status(200).json(simulatedResponse);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            status: 'errored',
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`External Adapter listening on port ${PORT}`);
});
