//console.log('hello')

const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./movies-data-small.json')

const app = express()

app.use(morgan('dev'))

/*app.use((req, res) => {
  res.send('Hello, world!')
})*/

function handleGetMovie(req, res) {
  //let response = MOVIES;
  //res.json(response);
}

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
console.log(`Server listening at http://localhost:${PORT}`)
})
