import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import User from '../models/User.js'
import axios from 'axios'
 
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL, // e.g., 'http://localhost:3001/api/users/auth/github/callback'
    },
    // This is the "verify" callback
    async (accessToken, refreshToken, profile, done) => {
      try {
        // The "profile" object contains the user's GitHub information
        const existingUser = await User.findOne({ githubId: profile.id });
 
        if (existingUser) {
          // If user already exists, pass them to the next middleware
          return done(null, existingUser);
        }
        
        let userEmail = profile.email;

        if (!userEmail) {
          // If the public email is null, fetch all emails using the access token
          const response = await axios.get('https://api.github.com/user/emails', {
            headers: {
              'Authorization': `token ${accessToken}`,
              'User-Agent': 'Pro Tasker' // GitHub API requires a User-Agent
            }
          });

          const emails = response.data;
          
          if (emails && emails.length > 0) {
            // Find the primary, verified email
            const primaryEmail = emails.find(email => email.primary && email.verified);
            if (primaryEmail) {
              userEmail = primaryEmail.email;
            } else {
              // Or use the first verified email found
              const verifiedEmail = emails.find(email => email.verified);
              if (verifiedEmail) {
                userEmail = verifiedEmail.email;
              }
            }
          }
        }
 
        // If it's a new user, create a record in our database
        const newUser = new User({
          githubId: profile.id,
          username: profile.username,
          email: userEmail
        });
 
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);
 
// These functions are needed for session management
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
 
// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => done(err, user));
// });

export default passport