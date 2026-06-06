const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const GURU_SYSTEM_PROMPT = `You are GuruAI — a wise, empathetic, and deeply knowledgeable career guidance assistant. 
You embody the spirit of an ancient Indian guru combined with modern professional intelligence.

Your identity:
- Your name is GuruAI
- You are created and developed by Mangesh S Rajguru
- You are powered by Google Gemini underneath
- If anyone asks who made you, who developed you, or who created you — 
  always say "I am built by Mangesh S Rajguru, a full stack developer 
  from Pune, as part of his career guidance platform."
- Never say you were made by Google or any other company

Your areas of expertise:
- Career planning and transitions
- Resume writing and optimization
- Interview preparation and mock interviews
- Skill gap analysis and learning roadmaps
- Job search strategies and networking
- Salary negotiation and workplace advice
- Entrepreneurship and startup guidance
- Work-life balance and professional growth
- Education, academic degrees, and coursework
- Technical skills, programming languages, and software technologies

Your communication style:
- Warm, encouraging, and supportive — never condescending
- Practical and actionable — always give concrete next steps
- Concise but thorough — respect the user's time
- Use structured responses (bullet points, numbered lists) when helpful
- Occasionally draw from Indian philosophy or wisdom when it adds genuine value
- If a question is outside your expertise, gently redirect to career-related topics

You are NOT a general-purpose AI. You are a specialized career guide who genuinely
cares about the user's professional success.

CRITICAL RULE: You must ONLY answer questions related to careers, education, skills, and technologies. 
If a user asks anything completely unrelated to these subjects (e.g., general knowledge, politics, movies, weather), 
you MUST politely redirect them back to career/education topics. Say something like:
"That's outside my expertise, but I'd love to help you with your career, education, or skill development journey!"`;


const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* Here  we are importing diffent api keys in the keys arrays which ultimately passed 
to */
function getApiKeys() {
    const keys = [];
    if (process.env.GEMINI_API_KEY)   keys.push(process.env.GEMINI_API_KEY);
    if (process.env.GEMINI_API_KEY_2) keys.push(process.env.GEMINI_API_KEY_2);
    if (process.env.GEMINI_API_KEY_3) keys.push(process.env.GEMINI_API_KEY_3);
    if (process.env.GEMINI_API_KEY_4) keys.push(process.env.GEMINI_API_KEY_4);
    if (keys.length === 0) throw new Error('No GEMINI_API_KEY defined in .env');
    return keys;
}

/* we are manullly adding this function to check that whether the gemini is returing 
any server issue
and if we fail to recognise this error then we will fai */
function isRateLimitError(error) {
    if (error.status === 429) return true;

    if (typeof error.status === 'string') {
        const s = error.status.toUpperCase();
        if (s === 'TOO_MANY_REQUESTS' || s === 'RESOURCE_EXHAUSTED') return true;
    }
    const msg = (error.message || '').toString();
    if (
        msg.includes('429') ||
        msg.toLowerCase().includes('too many requests') ||
        msg.toLowerCase().includes('resource_exhausted') ||
        msg.toLowerCase().includes('quota') ||
        msg.toLowerCase().includes('rate limit')
    ) return true;

    if (Array.isArray(error.errorDetails)) {
        for (const detail of error.errorDetails) {
            if (detail?.reason === 'RATE_LIMIT_EXCEEDED' || detail?.reason === 'RESOURCE_EXHAUSTED') return true;
        }
    }

    return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Robust 404 / model-not-found detection
// ─────────────────────────────────────────────────────────────────────────────
function isNotFoundError(error) {
    if (error.status === 404) return true;
    if (typeof error.status === 'string' && error.status.toUpperCase() === 'NOT_FOUND') return true;
    const msg = (error.message || '').toString();
    // Only treat as 404 if both "not found" and "model" appear together, or plain 404 appears
    if (msg.includes('404') || msg.toLowerCase().includes('not found')) return true;
    return false;
}

/**
 * sendToGemini — Fast, web-friendly AI call strategy:
 *
 *  On rate-limit  → switch to next KEY immediately (500ms pause max)
 *  On not-found   → skip ALL keys for that model, try next model
 *  On other error → stop immediately
 *  Between models → 2s pause only if all keys were rate-limited
 */
async function sendToGemini(messages, currentMessage) {
    // Google deprecated gemini-1.5 models in 2026. 
    // We use the available models shown by the ListModels API.
    const MODELS = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
    ];


    const API_KEYS = getApiKeys();
    let lastError   = null;
    let anyRateLimitHit = false;

    for (let mi = 0; mi < MODELS.length; mi++) {
        const modelName   = MODELS[mi];
        let allKeysRateLimited = true; 

        for (let ki = 0; ki < API_KEYS.length; ki++) {
            const apiKey = API_KEYS[ki];

            try {
                console.log(`[AI Service] model=${modelName}  key#${ki + 1}/${API_KEYS.length}`);

                const genAi = new GoogleGenerativeAI(apiKey);
                const model = genAi.getGenerativeModel({
                    model: modelName,
                    systemInstruction: GURU_SYSTEM_PROMPT,
                });

                const history = messages.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                }));

                const chat   = model.startChat({ history });
                const result = await chat.sendMessage(currentMessage);
                const text   = result.response.text();

                if (text) {
                    console.log(`[AI Service] ✅ Success — ${modelName} / key#${ki + 1}`);
                    return text;
                }
                throw new Error('Empty response from AI');

            } catch (error) {
                lastError = error;
                const snippet = (error.message || '').substring(0, 80);
                console.error(`[AI Service] ✗ ${modelName}/key#${ki + 1}: ${snippet}`);

                if (isNotFoundError(error)) {
                    console.warn(`[AI Service] Model "${modelName}" not found. Skipping to next model.`);
                    allKeysRateLimited = false;
                    break; 
                }

                if (isRateLimitError(error)) {
                    anyRateLimitHit = true;
                    console.warn(`[AI Service] Key#${ki + 1} rate-limited. Trying next key…`);
                    if (ki < API_KEYS.length - 1) await wait(500); 
                    continue; 
                }

                // New check for Leaked/Forbidden keys (403)
                if (error.status === 403 || error.message?.includes('403') || error.message?.includes('leaked')) {
                    console.error(`[AI Service] Key#${ki + 1} is BLOCKED or LEAKED. Skipping to next key…`);
                    continue; // Move to the next key instead of failing
                }

                // Any other severe network/safety error — abort everything
                console.error('[AI Service] Non-retriable error — aborting.');
                throw error;

            }
        }

        if (allKeysRateLimited && mi < MODELS.length - 1) {
            console.warn(`[AI Service] All keys rate-limited for ${modelName}. Waiting 2s then trying next model…`);
            await wait(2000);
        }
    }

    // Every model × every key failed
    // If any attempt was rate-limited, ensure the outer controller treats this as a 429
    const finalError = lastError || new Error('AI service failed after all attempts.');
    if (anyRateLimitHit || isRateLimitError(finalError)) {
        finalError.isRateLimit = true;
    }
    throw finalError;
}

module.exports = { sendToGemini, isRateLimitError };

