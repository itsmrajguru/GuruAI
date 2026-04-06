require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY_2;
        const genAi = new GoogleGenerativeAI(apiKey);
        
        const model = genAi.getGenerativeModel({ model: 'gemini-2.0-flash' });
        
        await model.generateContent('hello');
        fs.writeFileSync('error_dump_2.json', JSON.stringify({ success: true }));
    } catch (error) {
        fs.writeFileSync('error_dump_2.json', JSON.stringify({
            message: error.message,
            status: error.status,
            name: error.name
        }, null, 2));
    }
}
test();
