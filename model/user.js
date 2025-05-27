import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    first_name : {
        type: String, 
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    last_name : {
        type: String, 
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Inavalid email address']
    },
    password: {
        type: String, 
        required: true, 
        minlength : 8
    },
    role: {
            type: String,
            enum: ['user', 'admin'], 
            default: 'user'}
}, {timestamps: true});

//hashing password before saving
userSchema.pre('save', async function (next) {
    try{
        if(!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 8)
        next();
    }catch(error){
        return next(error)
    }
})

//compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    try{
        return await bcrypt.compare(candidatePassword, this.password)
    }catch(error){
        throw new error;
    }
};

export default mongoose.model('User', userSchema);