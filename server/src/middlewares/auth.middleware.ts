import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        const token = authorization?.replace('Bearer ', '')
        
        if(!token) return res.status(401).json({ status: "warning", message: "Token not valid" })
        
        jwt.verify(token, "secret", (err: any, user: any) => {
            if(err) return res.status(401).json({ status: "warning", message: "Token not valid" })
            
            req['user'] = user
            next()
        })
    } catch (error) {
        console.log(error)
        return res.status(403).json({})
    }
}