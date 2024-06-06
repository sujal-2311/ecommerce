import express from 'express'
import { registerController, loginController, testController, getOrdersController, getAllOrdersController, orderStatusController } from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'

const router = express.Router()

//routing
// REGISTER || METHOD POST
router.post('/register',registerController)

// LOGIN || METHOD POST
router.post('/login',loginController)

//test routes
router.get('/test',requireSignIn, isAdmin, testController)

//protected user route auth
router.get('/user-auth', requireSignIn, (req,res) => {
    res.status(200).send({ok:true})
})

//protected Admin route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req,res) => {
    res.status(200).send({ok:true})
})

//orders
router.get('/orders', requireSignIn, getOrdersController)

//allorders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

//order update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

export default router;  