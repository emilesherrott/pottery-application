const axios = require("axios")
const javaPort = process.env.JAVA_PORT

const logger = async (req, res, next) => {
    const logBody = {
        method: req.method,
        originalUrl: req.originalUrl
    }
    try {
        await axios.post(`http://java-logger:${javaPort}/log`, logBody)
    } catch (error) {
        console.log("Error", error.message)
    }
    next()
}

module.exports = {
    logger
}