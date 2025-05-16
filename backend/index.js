const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json())

app.get('/', (request, response) => {
  const nb_entries = persons.length
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${nb_entries} people</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end() /* either 204 or 404 */
  }
})

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: 'name and/or number missing',
    })
  }

  if( persons.find((person) => person.name === body.name)) {
    return response.status(404).json({
      error: 'name must be unique',
    })
  }

  const person = {
    name: body.name,
    number: String(body.number),
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001 // process.env.PORT is for Render.com (deployment on internet)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



