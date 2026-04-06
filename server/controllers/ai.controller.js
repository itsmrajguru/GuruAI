const conversationModel = require('../models/conversation.model.js');
const { sendToGemini } = require('../services/ai.service.js');


const chat = async (req, res) => {
    /* steps to send a message to the gemini service and get res from it
      
    step 1 :extract the userId
    step 2 :extract the message and conversationId from the body
    step 3 :check weather the user is having a complete new chat or 
            continuing the existing chat
            if new chat , create a new conversationId to store the chatMessages in the database
            otherwise find the existing conversationId and continue
    step 4 :Append the new message by the user in the conversation array
    step 5 :call the gemini service
    step 6 :Append the response given by the gemini in the conversation array
    step 7 :save the conversation
    step 8 :return the reply and conversation metadata to the frontend*/


    /* step 1: We are fetching the userId from JWT , so that we can 
    save the particular specific to the specific user */
    const userId = req.user.id;

    /* step 2: fetch msg and conversationId from body 
    here conversationId can be null 
    a)if null, then the user is having a new conversation
    b)else user is continuing the existing chat*/
    const { message, conversationId } = req.body;

    //check message empty or not ?
    if (!message || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Message cannot be empty.'
        });
    }

    try {
        /* step 3 :check weather the user is having a complete new chat or 
        continuing the existing chat
        if new chat , create a new conversationId to store the chatMessages in the database
        otherwise find the existing conversationId and continue*/
        let conversation;
        if (conversationId) {
            //continuing the existing conversation
            converstaion = await conversationModel.findOne({
                _id: conversationId,
                userId              //extra layer of security
            })
            //check the old conversation is present or not...
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "conversation not found."
                })
            }
        }
        else {
            /* create a new conversation id and start brand new conversation
            The title is auto-generated from the first 60 chars of the first message,
               so the sidebar immediately shows a meaningful label.*/
            const title = message.trim().substring(0, 60) + (message.trim().length > 60 ? '...' : '');
            conversation = await conversationModel.create({
                userId,
                title,
                messages: []
            })
        }
        /* step 4 :Append the new message by the user in the conversation array
           Why?
           Because sendToGemini takes two things separately:
                history = all previous messages (so Gemini remembers context)
                current message = the new message the user just sent

            This is how Gemini understands the conversation — you're literally 
            giving it the entire chat history every single time.Think of it like this —
            Gemini has no memory by itself.Every time you call it, it's completely fresh.
            So you have to give it the full history manually each time.

            Each time history grows bigger — that's how it remembers context.*/
        conversation.messages.push({ role: 'user', content: message.trim() });

        /* step 5 :Call the gemini api service*/
        const previousMessages = conversation.messages.slice(0, -1); //keep all but truncate new msg 
        const reply = await sendToGemini(previousMessages, message.trim());

        /* step 6:append Geminis reply to the conversation*/
        conversation.messages.push({ role: 'model', content: reply })

        /* step 7 :save the updated conversation to mongoDB */
        await conversation.save();

        /* step 8: return the reply and conversation metadata to the frontend */
        return res.status(200).json({
            success: true,
            reply,
            conversationId: conversation._id,
            title: conversation.title
        })
    } catch (e) {
        console.error('[AI Controller] chat error:', e.message);
        return res.status(500).json({
            success: false,
            message: e.message || 'AI service error. Please try again.'
        });
    }
}

/* this controller returns all the conversations but with titles only 
that too for the sidebar only */

const getconversions = async (req, res) => {
    /* firstly exctact the userId so that the server knows, of which
     user conversations are to be loaded */
    const userId = req.user.id;

    try {
        /* show only the title of the conversations 
          and sort it to display the latest one*/
        const conversations = await conversationModel
            .find({ userId })
            .select('_id title updated at')
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            conversations
        })
    } catch (e) {
        console.error('[AI Controller] getConversations error:', e.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to load conversations.'
        });
    }
};


/* this controller returns a single conversation with its full message history
and it runs when user clicks conversations in the sidebar*/

const getConversation = async (req, res) => {
    // extract the userID from req.user.id and the id from params.id
    try {
        /* we are finding the conversation by both _id and userId to prevent
        the users from accessing other users conversations */
        const conversation = await conversationModel.findOne({ _id: id, userId });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found.'
            })
        }
        return res.status(200).json({
            success: true,
            conversation
        })
    } catch (e) {
        console.error('[AI Controller] getConversation error:', e.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to load conversation.'
        });
    }
};

//This controller permanently removes a conversation and all its messages.

const deleteConversation = async (req, res) => {
    // extract the userId and id
    const userId = req.user.id;
    const { id } = req.params;

    try {
        //delete the conversation parmentaly only if both the id and userId exists
        const deleted = await conversationModel.findOneAndDelete({ _id: id, userId })
        if (!deleted) {
            return res.status(404).json({
                success: true,
                message: 'Conversation not found.'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Conversation deleted.'
        });
    } catch (e) {
        console.error('[AI Controller] deleteConversation error:', e.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete conversation.'
        });
    }
};
module.exports = {
    chat,
    getConversations,
    getConversation,
    deleteConversation
}
