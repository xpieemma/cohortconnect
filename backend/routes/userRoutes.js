import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from '../config/passport.js'
import { authMiddleware } from '../utils/auth.js'

const router = express.Router()
const secret = process.env.JWT_SECRET
const expiration = '24h'

// POST '/api/user/register' - Create new user account
router.post('/register', async (req, res) => {
    try {

        // hash the password with bcrypt
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
        
        // create a new user
        const user = await User.create({
            ...req.body,
            password: hashedPassword
        })

        // create a jwt token
        const payload = {
            username: user.username,
            email: user.email,
            _id: user._id
        }
        const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration})

        // respond with the token and user data in an object
        res.status(201).json({ token, user: payload })
    }
    catch(err) {
        res.status(400).json({ message: err.emssage })
    }
})

// POST '/api/user/login' - Login to existing user account
router.post('/login', async (req, res) => {
    try {

        // lookup the user by email
        const user = await User.findOne({ email: req.body.email })

        // check if user exists (if false respond with an error)
        if(!user) return res.status(404).json({ message: 'Invalid email or password' })

        // check if hashed passwords match using bcrpty (if false respond with an error)
        const correctPassword = await bcrypt.compare(req.body.password, user.password)
        if(!correctPassword) return res.status(404).json({ message: 'Invalid email or password' })

        // create a jwt token
        const payload = {
            username: user.username,
            email: user.email,
            _id: user._id
        }
        const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration})

        // respond with the token and user data in an object
        res.status(200).json({ token, user: payload })
    }
    catch(err) {
        res.status(400).json({ message: err.emssage })
    }
})

// Route to start the OAuth flow
// When a user visits this URL, they will be redirected to GitHub to log in.
router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }) // Request email scope
);
 
// The callback route that GitHub will redirect to after the user approves.
router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.CLIENT_ORIGIN}/login`, // Where to redirect if user denies
    session: false // We are using tokens, not sessions
  }),
  (req, res) => {
    // At this point, `req.user` is the user profile returned from the verify callback.
    // We can now issue our own JWT to the user.
    // const token = signToken(req.user);
    // create a jwt token
    const payload = {
        username: req.user.username,
        email: req.user.email,
        _id: req.user._id
    }
    const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration})

    // Redirect the user to the frontend with the token, or send it in the response
    res.redirect(`${process.env.CLIENT_ORIGIN}/login?token=${token}`);
  }
);

// verify logged in user's token
router.use(authMiddleware)

// after verification, send back the user details (payload)
router.get('/', (req, res) => {
    res.status(200).json(req.user)
})

export default router