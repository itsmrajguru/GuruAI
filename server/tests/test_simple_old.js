require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY; // <-- Old key
        const genAi = new GoogleGenerativeAI(apiKey);
        
        const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        await model.generateContent('hello');
        fs.writeFileSync('error_dump_old.json', JSON.stringify({ success: true }));
    } catch (error) {
        fs.writeFileSync('error_dump_old.json', JSON.stringify({
            message: error.message,
            status: error.status,
            name: error.name
        }, null, 2));
    }
}
test();
