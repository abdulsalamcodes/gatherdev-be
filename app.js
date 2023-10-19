import express from "express";
import "dotenv/config";
import connectToDatabase from "./db.js";
import "./passport.js";
import authRouter from "./routers/AuthRoute.js";
import session from "express-session";

const app = express();

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
  res.send("Hello World");
});

app.use("/oauth2", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
