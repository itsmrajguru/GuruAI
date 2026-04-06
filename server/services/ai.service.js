require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// this is the GuruAi system Prompt,that includes the initial context as a guide for guruAi
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

Your communication style:
- Warm, encouraging, and supportive — never condescending
- Practical and actionable — always give concrete next steps
- Concise but thorough — respect the user's time
- Use structured responses (bullet points, numbered lists) when helpful
- Occasionally draw from Indian philosophy or wisdom when it adds genuine value
- If a question is outside your expertise, gently redirect to career-related topics

You are NOT a general-purpose AI. You are a specialized career guide who genuinely
cares about the user's professional success.

If a user asks anything completely unrelated to career, 
professional growth, or work — politely redirect them back 
to career topics. Say something like "That's outside my 
expertise, but I'd love to help you with your career journey! `;

const sendToGemini = async (messages, userMessage) => {

   /* steps to get response from the Gemini
   step 1 :ensure that the api key is working fine
   step 2 :Initialize the gemini client using  GoogleGenerativeAI()
   step 3 :Initialize the gemini model using genai.getGenerativeModel()
   step 4 :convert the DBMessage format into gemini expected  format
   step 5: start a chat session with the full conversation history using model.startChat()
   
           This is what gives Gemini context about what was said before */
   /* step 6: send the new user message and await the reply using chat.sendMessage()

          sendMessage() automatically appends to the chat history internally */



   // step 1 :ensure that the api key is working fine
   if (!process.env.GEMINI_API_KEY) {
      console.error('[AI Service] GEMINI_API_KEY is not set in .env');
      throw new Error('AI service is not configured. Please add GEMINI_API_KEY to your .env file.');
   }
   // step 2 :Initialize the gemini client
   const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
   // step 3 :Initialize the gemini model
   const model = genAi.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: GURU_SYSTEM_PROMPT
   })

   /*step 4 :convert the DBMessage format into gemini expected  format
      Our format    : { role: 'user'|'model', content: 'text...' }
      Gemini format : { role: 'user'|'model', parts: [{ text: 'text...' }] } */

   const history = messages.map(msg => ({
         role: msg.role,
         parts:[{ text: msg.content }]
   }));

   /* step 5: start a chat session with the full conversation history
       This is what gives Gemini context about what was said before */
   const chat=model.startChat({history});

   /* step 6: send the new user message and await the reply
          sendMessage() automatically appends to the chat history internally */
   const result=await chat.sendMessage(userMessage);
   const reply=result.response.text();

   return reply
}
module.exports={sendToGemini}
