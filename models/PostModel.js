import { Schema, model } from "mongoose";

const PostSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    code: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});


export default model('Post', PostSchema);