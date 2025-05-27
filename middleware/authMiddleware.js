import jwt from 'jsonwebtoken'
import User from '../model/user.js'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'yourJWTSecret';

const authMiddleware = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      token = authHeader.split(' ')[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      req.user = { 
        userId: user._id,
        role : user.role
       }; 
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

export default authMiddleware;
