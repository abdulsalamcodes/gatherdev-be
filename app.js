import express from "express";
import "dotenv/config";
import cors from "cors";
import session from "express-session";

import "./passport.js";
import connectToDatabase from "./db.js";
import authRouter from "./routes/AuthRoute.js";
import postRouter from "./routes/PostRoute.js";

const app = express();

app.use(cors());
var sess = {
  secret: "keyboard cat",
  cookie: {},
};

if (process.env.ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(sess));

// connect to db
connectToDatabase();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Gather API",
    success: true,
  });
});

app.use("/oauth2", authRouter);
app.use("/post", postRouter);

app.use("*", (req, res) => {
  return res.status(400).send("Invalid Page, please, return to home page");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
