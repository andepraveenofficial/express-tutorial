# OAuth2.0

### Setup

- Install passport : `npm install passport`
- Install google auth : `npm install passport-google-oauth2`

- Configuration

```js
let GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://yourdomain:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);
```

### Documentation

- GOogle Auth2.0 : `https://www.passportjs.org/packages/passport-google-oauth2/`

### Checking

- Open a web browser and navigate to http://localhost:5000/auth/google.
  You should be redirected to Google's login page. If this happens, it means your route and Google Strategy are set up correctly.
- Log in with your Google account. If you're already logged in, you might just see a permission screen.
- After successful authentication, you should be redirected to http://localhost:5000/success.
- Check your server console. You should see "I am Success Route" logged, followed by the user profile information.
- If you see the success message and user data, your OAuth flow is working correctly!
