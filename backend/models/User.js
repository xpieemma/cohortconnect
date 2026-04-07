import mongoose, { Schema }  from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must use a valid email address']
    },
    password: {
        type: String,
        minLength: 5,
        required: function() {
            return !this.githubId
        }
    },
    permissions: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true
    },
    githubUsername: {
        type: String,
        unique: true,
        sparse: true
    },
    githubAccessToken: {
        type: String,
        unique: true,
        sparse: true
    },
    cohorts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cohort',
            required: true
        }
    ]
})

const User = mongoose.model('User', userSchema)

export default User