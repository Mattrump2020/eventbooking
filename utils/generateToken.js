import jwt from 'jsonwebtoken'

/**
 * Generate a JWT token with userId and role
 * @param {String} userId
 * @param {string} role
 * @param {String} expiresIn (optional) default = '30m'
 */

const JWT_SECRET = process.env.JWT_SECRET || 'yourJWTSecret';

const generateToken = (userId, role, expiresIn ='1h') =>{
    return jwt.sign({userId, role}, JWT_SECRET, {expiresIn})
}

export default generateToken