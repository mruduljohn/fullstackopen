const express = require('express')
const app = express()

app.use(express.json())
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

app.get('/info', (req, res) => {
    const date = new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p>
                  <p>${date}</p>` 
    res.send(info)
})
app.get('/api/persons', (req, res) => {
    res.json(persons)
  })
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => {
        //console.log(note.id, typeof note.id, id, typeof id,note.id===id)
        return person.id === id})
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    } 
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
    return maxId + 1
}


app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const person = {
    content : body.content,
    important : body.important || false,
    id : generateId(),
    }
    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

