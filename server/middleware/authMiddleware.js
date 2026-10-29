
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  // Read the Authorization header
  const authHeader = req.headers.authorization

  // Extract the token from "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      message: 'Access token required',
    })
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({
        message: 'Invalid or expired token',
      })
    }

    req.user = user
    next()
  })
}

module.exports = authenticateToken
