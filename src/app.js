const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Root endpoint
app.get('/', (req, res) => {
    res.send('Hello, World! Express server is running.');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/start', async (req, res) => {
    const { deviceId } = req.body;
    if (!deviceId) {
        return res.status(400).json({ message: 'deviceId is required' });
    }
    const dataPoint = {
        deviceId,
        value: 70,
    };
    try {
        const response = await axios.put('https://lambda.proto.aalto.fi/api/datapoints', dataPoint);
        res.status(200).json({ message: 'Data sent successfully', data: response.data });
    } catch (error) {
        console.error('Error sending data:', error);
        res.status(500).json({ message: 'Error sending data', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});