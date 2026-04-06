const express=require('express')
const aiRouter=express.Router()

//importing middleware
const {protect}=require('../middleware/auth.middleware')

//importing controller 
const aiController=require('../controllers/ai.controller')

//routes for Gemini chat service integration

//to post a message to gemini and get reply
aiRouter.post('/chat',protect,aiController.chat)

//to get all conversations to display in the sidebar
aiRouter.get('/conversations',protect,aiController.getConversations)

//to get a single conversation with full messages
aiRouter.get('/conversations/:id',protect, aiController.getConversation)

//to permentaly delete a conversation
aiRouter.delete('/conversations/:id',protect, aiController.deleteConversation)

module.exports={aiRouter};
