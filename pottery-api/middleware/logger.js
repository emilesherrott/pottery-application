const axios = require("axios");
const javaPort = process.env.JAVA_PORT || 8080;

const logger = async (req, res, next) => {
  if (process.env.TEST_ENV) {
    console.log("[TEST] Logger:", req.method, req.originalUrl);
    return next();
  }

  const logBody = {
    method: req.method,
    originalUrl: req.originalUrl,
  };

  try {
    await axios.post(`http://java-logger:${javaPort}/log`, logBody);
  } catch (error) {
    console.log("Logger error:", error.message);
  }

  next();
};

module.exports = { logger };