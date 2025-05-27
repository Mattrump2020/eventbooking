
import User from '../model/user.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/email.js' 
import dotenv from 'dotenv'

dotenv.config()

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
const signUp = async (req, res, next) =>{
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL
    try{
        const { first_name, last_name, email, password} = req.body;
        
        if('role' in req.body){
            return res.status(403).json({message : 'cannot assign role manually'})
        }

        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(409).send("User already exist");
        }

        let role = 'user';
        if(email === ADMIN_EMAIL){
            role = 'admin'
        }
        
        const newUser = new User ({ first_name, last_name, email, password, role});
        await newUser.save();

        const token = generateToken(newUser._id, newUser.role)

        try {
            await sendEmail({
                to: User.email,
                subject: "Welcome to Our Event Booking App",
                text: 'Dear ${User.name}, welcome to our platform!',
                html: "<p>Dear ${User.name}, welcome to our platform!</p>"
            })
        }catch (error) {
            console.error('Error sending welcome email:', error)
        }

        return res.status(201).json({
            message: `User registered as ${role}`,
            token,
            user: {...newUser.toObject(), password : undefined}
        });
    }
    catch(error){
        console.error(error);
        next (error); 
    }
}

const signIn = async (req,res) =>{
   
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).send("User not found")
        }

        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return res.status(401).send("Invalid password or email")
        }

        const token = generateToken(user._id, user.role)

        return res.status(200).json({
            message: "Login successful",
            token,
            user 
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            message:"server Error",
            error: error.message
        })
    }


}

// @desc    Get current user
// @route   GET /auth/me
// @access  Private
const getMe = async (req, res) => {
    try{
        const user = await User.findById(req.user.userId).select('-password')
        if(!user){
            return res.status(404).send('User not found')
        }
        return res.status(200).json(user)
    }catch(error){
        console.error(error)
        res.status(500).json({
            message: "An error occured",
            error: error.message
        })
    }
    
}

//@desc LogOut User
//@route POST/auth/logout
//@access Private

const signOut = (req, res) =>{
    res.status(200).json({ message: 'Logged out successfully'})
}

export {signUp, signIn, getMe, signOut}