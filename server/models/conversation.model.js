const mongoose = require('mongoose');


/* this is a advanced style of struture where
 one user can have multiple conversations and each conversation has many messages.*/

//message Schema stores the details of every message flow between the user and model
const messageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ['user', 'model'],
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    {
        /* we are adding timestamp to each message , so that
        it can be find and sorted easily */
        timestamps: { createdAt: 'timestamp', updatedAt: false }
    }
);

// this is the conversation schema that will store every conversation seperatley
const conversationSchema = new mongoose.Schema(
    {
        //the conversations will be linked to the user through userId
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        /* Auto-generated from the first user message (truncated to 60 chars).
           Displayed in the sidebar as the conversation label. */
        title: {
            type: String,
            default: 'New Conversation'
        },

        //imported all message as a list of arrays
        messages: [messageSchema]
    },
    {
        // createdAt and updatedAt are auto-managed by Mongoose
        timestamps: true
    }
);

const conversationModel = mongoose.model('Conversation', conversationSchema);
module.exports = conversationModel;
