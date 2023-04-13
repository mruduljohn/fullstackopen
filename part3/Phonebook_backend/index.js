
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/Person')
const app = express()

app.use(express.static('build'))
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms:body',
    { skip: function (req, res) { return res.status >= 400 } 
}))
/*
let persons = [
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
*/
app.get('/info', (req, res) => {
    const date = new Date().toString()
    Person
        .find({})
        .then(persons => {
            res.send(
                `<p>Phonebook has info for ${persons.length} people</p>
                <p>${date}</p>`
            )
        })
})



app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
        res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if(person){
                res.json(person)
            }else{
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res,next) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/persons', (req, res,next) => {
    const body = req.body

    const contact = new Person({
        name : body.name,
        number : body.number,
    })
    contact
        .save()
        .then(savedContact => savedContact.toJSON())
        .then(savedAndFormattedContact => {
            res.json(savedAndFormattedContact)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const contact = {
        name : body.name,
        number : body.number,
    }
    Person
    .findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedContact => {
        if(updatedContact){
            res.json(updatedContact)
        }else{
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req,res) => {
    res.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if(error.name === 'CastError'){
        return res.status(400).send({error: 'malformatted id'})
    }else if(error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.port || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

