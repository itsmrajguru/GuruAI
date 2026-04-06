require('dotenv').config();
const { sendToGemini } = require('../services/ai.service.js');

async function test() {
    try {
        console.log('Testing Gemini...');
        const response = await sendToGemini([{ role: 'user', content: 'hello' }], 'hi');
        console.log('Response:', response);
    } catch (error) {
        console.error('Test failed:', error);
        if (error.response) {
            console.error('Error response data:', error.response);
        }
    }
}

test();
