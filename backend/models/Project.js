import mongoose, { Schema } from "mongoose"

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ]
})

const Project = mongoose.model('Project', projectSchema)

export default Project