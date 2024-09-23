const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();

app.use(express.json());

const port = 5000;

// OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // Here you should handle user creation/retrieval from your database
      // For this example, we'll just pass the profile as the user
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

/* -----> Session Storage <----- */
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "mySecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using https
  })
);

app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
  req.isAuthenticated() ? next() : res.sendStatus(401);
}

app.get("/", (req, res) => {
  console.log("I am Home Route");
  res.send("I am Home Route");
});

/* -----> OAuth Routes <----- */
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  function (req, res) {
    // Successful authentication, redirect to success.
    res.redirect("/success");
  }
);

app.get("/success", isLoggedIn, (req, res) => {
  console.log("I am Success Route");
  console.log(req.user);
  res.send("I am Home Success Route");
});

app.get("/failure", (req, res) => {
  console.log("I am Failure Route");
  res.send("Authentication failed");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
