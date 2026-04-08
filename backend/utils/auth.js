import jwt from 'jsonwebtoken'



export async function authMiddleware(req, res, next) {
    try {
        
        let token = req.headers.authorization?.split(' ').pop().trim();
        if (!token) return res.status(403).json({ message: 'No token provided' })
        

        
        const { data } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(data._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        req.user = data
        next()
    }
    catch(err) {
        console.log(err.message)
        res.status(400).json({ message: err.message || 'Invalid token' })
    }
}