import { verify } from "argon2";
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  googleId: {
    type: String,
  },
  title: {
    type: String,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// Define a method to verify the password
UserSchema.methods.verifyPassword = async function (candidatePassword) {
  try {
    return await verify(this.password, candidatePassword);
  } catch (error) {
    throw error;
  }
};

const User = model("User", UserSchema);

export default User;
