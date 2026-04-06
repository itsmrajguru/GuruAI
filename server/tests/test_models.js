require('dotenv').config();
const fs = require('fs');

async function test() {
    const apiKey = process.env.GEMINI_API_KEY_2;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        fs.writeFileSync('models_dump.json', JSON.stringify(data, null, 2));
    } catch (e) {
        fs.writeFileSync('models_dump.json', JSON.stringify({ error: e.message }));
    }
}
test();
