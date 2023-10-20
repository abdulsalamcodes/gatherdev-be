import Post from "../models/PostModel.js";

export const createPost = async (req, res) => {
  try {
    const { content, code, author } = req.body;
    const newPost = { content, code, author: author };
    const post = await Post.create(newPost);

    // Populate the "author" field before sending the response
    await post.populate("author");

    res.status(200).json({
      message: "Post created successfully",
      success: true,
      data: {
        post: post,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `Error creating the post: ${
        error.message || "An error occurred"
      }`,
      success: false,
    });
  }
};

export const fetchPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate("author");
    res.status(200).json({
      message: "Posts fetched successfully",
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error fetching posts: ${error.message || "An error occurred"}`,
      success: false,
    });
  }
};
