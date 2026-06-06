//creating widgetControllers
const { sendToGemini, isRateLimitError } = require('../services/ai.service.js');

/* widgetChat controller */
const widgetChat = async (req, res) => {
    /* step 1 : extract message and history from req.body */
    const { message, history = [] } = req.body;

    /* condition : if message is empty, return error */
    if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    try {
        /* step 2 : send message to gemini and wait for reply */
        const reply = await sendToGemini(history, message.trim());
        return res.status(200).json({ success: true, reply });
    } catch (e) {
        console.error('[Widget Controller] error:', e.message);
        /* condition : if error is due to rate limit, return 429 */
        if (e.isRateLimit || isRateLimitError(e)) {
            return res.status(429).json({
                success: false,
                message: 'GuruAI is a bit busy right now. Please wait a moment and try again.'
            });
        }
        return res.status(500).json({ success: false, message: 'GuruAI encountered an error. Please try again.' });
    }
};

module.exports = { widgetChat };
