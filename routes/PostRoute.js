import { Router } from "express";
import { createPost, fetchPosts } from "../controllers/PostController.js";

const postRouter = Router();

// Define a route to fetch posts
postRouter.get("/", fetchPosts);

// Define a route to create a new post
postRouter.post("/", createPost);

export default postRouter;
