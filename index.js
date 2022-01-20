require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/contact')

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
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(person => person.id != id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    } 

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})