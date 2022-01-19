const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('postData', (request) => {
    if (request.method == 'POST') return ' ' + JSON.stringify(request.body);
    else return ' ';
  });
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :postData')
app.use(logger)

let contacts = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const pbCount = contacts.length
    const dateTime = new Date()
    response.send(`
    <p>Phonebook has info for ${pbCount} people</p>
    
    <p>${dateTime}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = contacts.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(person => person.id != id)

    response.status(204).end()
})

const generateID = () => {
    const rand = Math.random()
    return Math.floor(rand * 100)
}
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    } else if (contacts.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'person by that name already exists'
        })
    } else if (contacts.find(person => person.number === body.number)) {
        return response.status(400).json({
            error: 'that number already exists'
        })
    } else {
        const person = {
            id: generateID(),
            name: body.name,
            number: body.number
        }

        contacts = contacts.concat(person)
        response.json(person)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})