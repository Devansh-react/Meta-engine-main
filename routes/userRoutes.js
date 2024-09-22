import express from "express";
import {
  loginController,
  logoutController,
  passwordResetController,
  registerController,
  udpatePasswordController,
  successGoogleLogin,
  failureGoogleLogin

} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import passport from "passport";
// import { userController } from "../controllers/userController.js";
const router = express.Router();





import { rateLimit } from "express-rate-limit";

//Oauth
router.use(passport.initialize());
router.use(passport.session());


// router.get('/', userController.loadAuth);

// Auth .
router.get('/auth/google', passport.authenticate('google', {
  scope:
    ['email', 'profile']
}));

// Auth Callback 


router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/success',
    failureRedirect: '/failure'
  }));

// Success 
router.get('/success', successGoogleLogin);

// failure 
router.get('/failure', failureGoogleLogin);







// RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

//router object

//routes
// register
router.post("/register", limiter, registerController);

//login
router.post("/login", limiter, loginController);

//logout
router.get("/logout", isAuth, logoutController);

// updte password
router.put("/update-password", isAuth, udpatePasswordController);

// FORGOT PASSWORD
router.post("/reset-password", passwordResetController);

//export
export default router;
