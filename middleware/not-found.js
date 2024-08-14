const notFoundMiddleware = (req, res) => {
    res.status(404).json({ msg: 'route does not exist' })
}

export default notFoundMiddleware