const movieRoutes = require('./routes/movieRoutes')
const authRoutes = require('./routes/authRoutes')
const myListRoutes = require('./routes/myListRoutes')


const express = require('express')
const cors = require('cors')



require('dotenv').config()

const connectDB = require('./db')

const app = express()
app.use(cors())
app.use(express.json())
app.use(movieRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/my-list', myListRoutes)




// Start server
async function startServer() {
  await connectDB()

  app.listen(process.env.PORT || 5000, () => {
    console.log('StreamFlix server is running')
  })
}

startServer()