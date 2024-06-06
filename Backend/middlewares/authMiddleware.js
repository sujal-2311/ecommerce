import JWT from 'jsonwebtoken';
import pool from '../config/db.js';

//protected Routes token base
export const requireSignIn = async (req,res,next) => {
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.user = decode;
        next();
    } catch(error){
        console.log(error);
    }
}

//admin access
export const isAdmin = async (req, res, next) => {
    try {
      const userId = req.user.id;
    
      // Query PostgreSQL to find the user by their ID
      const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = userQuery.rows[0];
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      } else if (user.role !== 1) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized Access",
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in admin middleware",
      });
    }
  };
  