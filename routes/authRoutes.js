import { register, login, updateUser } from '../controllers/authController.js'
import authenticateUser from '../middleware/authentication.js'
import { Router } from 'express'
const router = Router()



router.route('/login').post(login)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/register').post(register)


export default router




