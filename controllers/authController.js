import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'
import User from '../models/User.js'

const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        throw new BadRequestError('please provide all the values')
    }
    const user = await User.create(req.body)
    const token = user.createJWT()
    const userResponse = await User.findById(user._id).select({ name: 1, email: 1, lastName: 1, location: 1 })
    res.status(StatusCodes.OK).json({ user: userResponse, token, location: user.location })
}
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('please provide all credentials')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('invalid credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('invalid credentials')
    }
    const token = user.createJWT()
    user.password = undefined
    res.status(StatusCodes.OK).json({ user, token, location: user.location })
}
const updateUser = async (req, res) => {
    const { email, name, lastName, location } = req.body
    if (!email || !name || !lastName || !location) {
        throw new BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ _id: req.user.userId })
    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location
    await user.save()
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({
        user,
        token,
        location: user.location,
    })
}

export { register, login, updateUser }