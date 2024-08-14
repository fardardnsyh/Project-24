import express from 'express'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'
import { config } from 'dotenv'
const app = express()
config()

// import middlewares

import notFoundMiddleware from './middleware/not-found.js'
import errorHandler from './middleware/error-handler.js'
import authenticateUser from './middleware/authentication.js'
import 'express-async-errors'
import morgan from 'morgan'

// import connection 
import connectDB from './db/connect.js'
// import router
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobRoutes.js'

app.get('/api', (req, res) => {
    res.json({ msg: 'welcome people' })
})
const __dirname = dirname(fileURLToPath(import.meta.url))

// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')))
// built in middlewares
app.use(express.json())
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}
// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

// my middlewares
app.use(notFoundMiddleware)
app.use(errorHandler)
const port = process.env.PORT || 5000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`the app is listenin on port : ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}
start()

console.log('server is running ...');