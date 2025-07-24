const express = require('express')
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')

const PORT = process.env.PORT || 5003

// Initialize EXPRESS APP
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan())

// Start   the server
app.listen(PORT, () => {
  console.log(`Appointment Service is running on port ${PORT}`)
})