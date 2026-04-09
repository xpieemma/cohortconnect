import express from 'express'
import User from '../models/User.js'
import Cohort from '../models/Cohort.js'
import { toggleElement } from '../controllers/utils.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from '../config/passport.js'
import { authMiddleware } from '../utils/auth.js'

const router = express.Router()
const secret = process.env.JWT_SECRET
const expiration = '24h'


router.post('/register', async (req, res) => {
    try {


        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
        
    
        let user = await User.create({
            ...req.body,
            password: hashedPassword
        })

        await user.populate(['cohorts'],'-password')

       
        const payload = {
            username: user.username,
            email: user.email,
            permissions: user.permissions,
            cohorts: user.cohorts,
            _id: user._id
        }
        const token = jwt.sign({ data: payload }, secret, { expiresIn: '24h'});
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
        res.status(201).json({ token, user: payload })
    }
    catch(err) {
        res.status(400).json({ message: err.emssage })
    }
})


router.post('/login', async (req, res) => {
    try {

    
        const user = await User.findOne({ email: req.body.email })
            .populate(['cohorts'],'-password')

        
        if(!user) return res.status(404).json({ message: 'Invalid email or password' })

        
        if(!user.password && user.githubId) return res.status(404).json({ message: 'Invalid email or password, try logging in with GitHub' })

        const correctPassword = await bcrypt.compare(req.body.password, user.password)
        if(!correctPassword) return res.status(404).json({ message: 'Invalid email or password' })

        const payload = {
            username: user.username,
            email: user.email,
            permissions: user.permissions,
            cohorts: user.cohorts,
            _id: user._id
        }
        const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration})

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });

        res.status(200).json({ token, user: payload })
    }
    catch(err) {
        res.status(400).json({ message: err.emssage })
    }
})

router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email', 'user:follow'] }) // Request email scope
);
 

router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.CLIENT_ORIGIN}/login`, 
    session: false // We are using tokens, not sessions
  }),
  (req, res) => {
    // At this point, `req.user` is the user profile returned from the verify callback.
    // We can now issue our own JWT to the user.
    // const token = signToken(req.user);

    // create a jwt token
    // console.log(req.user)
    const payload = req.user
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

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        if(req.user._id !== id) return res.status(403).json({ message: 'You are not authorized to delete that account' })
        // lookup all users
        await User.findByIdAndDelete(id)

        await Cohort.updateMany(
            { },
            { $pull: { users: id } }
        );

        // respond with the token and user data in an object
        res.status(200).json({message: 'User deleted!'})
    }
    catch(err) {
        res.status(400).json({ message: err.emssage })
    }
})

// POST '/api/users/list' - return a list of all users to an authenticated user
router.get('/list', async (req, res) => {
    try {
        // lookup all users
        const users = await User.find({},'username')

        // respond with the token and user data in an object
        res.status(200).json(users)
    }
    catch(err) {
        res.status(400).json({ message: err.emssage })
    }
})

router.put('/:userId/:cohortId', async (req, res) => {
    try {
        // see if the user exists
        const user = await User.findOne({ _id: req.params.userId })
        if(!user) return res.status(404).json({ message: 'No user found by that id!' })

        // see if the cohort exits
        const cohort = await Cohort.findById(req.params.cohortId)
            .populate(['organization','users'], "-password")
        if (!cohort) {
        return res
            .status(404).json({ message: "No cohort found with this id!" })
        }

        const updatedUser = await toggleElement(
            User,
            req.params.userId,
            'cohorts',
            req.params.cohortId
        )

        const updatedCohort = await toggleElement(
            Cohort,
            req.params.cohortId,
            'users',
            req.params.userId
        )

        if(updatedUser !== updatedCohort) throw new Error ('Data mismatch while adding/removing cohort.')

        // respond with the token and user data in an object
        res.status(200).json({message: 'Updated'})
    }
    catch(err) {
        res.status(400).json({ message: err.emssage })
    }
})

export default router