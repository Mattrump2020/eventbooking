const roleMiddleware = (role) => {
    
    return (req, res, next) => {
        if (req.user && req.user.role === role){
            next();
        }else {
            return res.status(403).json({
                message : `Unathorized: You must be an ${role} to access this route`
            })
        }
    }
}

export default roleMiddleware