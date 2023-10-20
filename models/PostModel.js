import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 5, // Minimum content length
      maxlength: 1000, // Maximum content length
    },
    code: String, // Optional code field
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true, // Automatically add "createdAt" and "updatedAt" fields
  }
);

// Define a static method for finding posts by a specific author
PostSchema.statics.findByAuthor = function (authorId) {
  return this.find({ author: authorId });
};

const Post = model("Post", PostSchema);

export default Post;
