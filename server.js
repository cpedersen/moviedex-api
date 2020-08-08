//console.log('hello')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movies-data-small.json')

//console.log(process.env.API_TOKEN)
const app = express()

//app.use(morgan('dev'))
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

app.use(helmet())
app.use(cors())

/*app.use((req, res) => {
  res.send('Hello, world!')
})*/

app.use(function validateBearerToken(req, res, next) {
  //const bearerToken = req.get('Authorization').split(' ')[0]
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[0] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
  }
  //move to the next middleware
  next()
})

app.use(function validateBearerToken(req, res, next) {
  console.log('validate bearer token middleware')
  // move to the next middleware
  next()
})

function handleGetMovies(req, res) {
  let response = MOVIES;
  //console.log("MOVIE: " + MOVIES);
  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }
  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }
  if (req.query.avg_vote) {
    console.log ("Number: " + req.query.avg_vote);
    response = response.filter(movie =>
      //movie.avg_vote >= req.query.avg_vote
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
    )
  }
  res.json(response);
}

app.get('/movie', handleGetMovies)

// 4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

//const PORT = 8000
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
console.log(`Server listening at http://localhost:${PORT}`)
})

