import { Router } from "express";
import { loginUser, registerUser } from "../controllers/AuthController.js";
import passport from "passport";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
  function (req, res) {
    res.redirect("/");
  }
);

export default authRouter;
