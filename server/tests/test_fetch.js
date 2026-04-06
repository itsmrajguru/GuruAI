require('dotenv').config();
const fs = require('fs');

async function test() {
    const apiKey = process.env.GEMINI_API_KEY_2;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'hello' }] }]
            })
        });
        
        const data = await response.json();
        fs.writeFileSync('fetch_dump.json', JSON.stringify({
            status: response.status,
            data: data
        }, null, 2));
    } catch (e) {
        fs.writeFileSync('fetch_dump.json', JSON.stringify({ error: e.message }));
    }
}
test();
