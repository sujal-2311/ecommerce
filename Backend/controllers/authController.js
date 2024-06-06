import { compare } from 'bcrypt';
import pool from '../config/db.js'; // Assuming you have a database configuration file

import { hashPassword, comparePassword } from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken';

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body;
        // Validation
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(200).json({
                success: false,
                message: 'User already exists. Please login.'
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Register user
        const newUser = await pool.query(
            'INSERT INTO users (name, email, phone, address, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, email, phone, address, hashedPassword, role || 0] // Default role to 0 (regular user) if not provided
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({
            success: false,
            message: 'Error in registration',
            error: error.message
        });
    }
};


//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Check user
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Email is not registered'
            });
        }
        const match = await comparePassword(password, user.rows[0].password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Password'
            });
        }
        // Token
        const token = JWT.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.status(200).json({
            success: true,
            message: "Login Successful",
            user: {
                name: user.rows[0].name,
                email: user.rows[0].email,
                phone: user.rows[0].phone,
                address: user.rows[0].address,
                role: user.rows[0].role,
            },
            token,
        });
    } catch (error) {
        console.error('Error in Login:', error);
        res.status(500).json({
            success: false,
            message: 'Error in Login',
            error: error.message
        });
    }
};


//test controller
export const testController = (req,res) => {
    res.send("protected route");
    res.status(401).send({
        success: false,
        error,
        message: "Error in admin middleware"
    })
}

//orders
export const getOrdersController = async (req,res) => {
    try {
        // const { id } = req.user; // Assuming req.user contains user information with user_id

        const query = `select buyer , products , status from orders`

        const orders = await pool.query(query);

        res.json(orders.rows);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error While Getting Orders"
        })
    }
}


//all orders
export const getAllOrdersController = async (req,res) => {
    try {
        // const { id } = req.user; // Assuming req.user contains user information with user_id

        const query = `select buyer , products , status from orders`

        const orders = await pool.query(query);

        res.json(orders.rows);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error While Getting Orders"
        })
    }
}

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        console.log(orderId);
        console.log(status)

        // Update the order status
        await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2',
            [status, orderId]
        );

        // Retrieve the updated order
        const updatedOrder = await pool.query(
            'SELECT * FROM orders WHERE id = $1',
            [orderId]
        );

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder.rows[0],
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: 'Error While Updating Orders',
        });
    }
};



