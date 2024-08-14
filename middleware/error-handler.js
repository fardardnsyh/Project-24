import { StatusCodes } from "http-status-codes";

const errorHandler = async (err, req, res, next) => {
    console.log(err);
    const defaultErr = {
        msg: err.message || 'Something went wrong please try again',
        status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }
    if (err.name === 'ValidationError') {
        defaultErr.status = StatusCodes.BAD_REQUEST
        defaultErr.msg = Object.values(err.errors).map(item => item.message).join(',')
    }
    if (err.code === 11000) {
        defaultErr.status = StatusCodes.BAD_REQUEST
        defaultErr.msg = `${Object.keys(err.keyValue).join(' ')} should be unique`
    }

    return res.status(defaultErr.status).json({ msg: defaultErr.msg })
}


export default errorHandler