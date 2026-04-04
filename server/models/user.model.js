const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    date_joined: {
        type: Date,
        default: Date.now
    }
});


/* as a good practice we are hashing as well as comparing
entered password with the saved password in the model itself
...
we could do this in controller but as a good practice 
always deal with only req and res in the controller */

/*CONCEPT :
We save plain password to the user object in memory.
Before mongoose saves it to MongoDB, pre('save') intercepts it,
hashes the password, and THEN saves the hashed version to DB.

Plain password never reaches the database.

'this' refers to the current user document (in memory)
that is about to be saved.
*/

//run async function before we save the password in the database
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt)
})

//check whether the entered password is same as the previously present password ? 
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//creating a model
const userModel = mongoose.model('User', userSchema)
module.exports = userModel
