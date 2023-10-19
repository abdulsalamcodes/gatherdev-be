import { Model, Schema, model } from "mongoose";

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    code: {
        type: String,
    },
    parentPostId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
});

const Comment = model('Comment', CommentSchema);

export default Comment;