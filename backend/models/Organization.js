import mongoose, { Schema }  from 'mongoose'

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    imageUrl: {
        type: String
    },
    website: {
        type: String
    }
})

const Organization = mongoose.model('Organization', organizationSchema)

export default Organization