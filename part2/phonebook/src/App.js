import { useState , useEffect } from 'react'
import axios from 'axios'

const Filter = ({newFilter, handleFilterChange}) => {
  return (
    <div>
        filter shown with <input value={newFilter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({addPerson,newName, newNum, handleNameChange, handleNumChange}) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div> 
          number: <input value={newNum} onChange={handleNumChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Persons = ({filteredpersons}) => {
  return (
    <ul>
          {filteredpersons.map(person => (
            <li key={person.name}>
              {person.name} {person.number}
            </li>
          ))}
    </ul>
  )
}



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])


  const addPersonToServer = (newPerson) => {
    axios
      .post('http://localhost:3001/persons', newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNum('')
      })
  }


  const addPerson = (event) => {
    event.preventDefault()
    console.log('button click', event.target)
    const newPerson = { name: newName , number: newNum }
    if(persons.some(person => person.name === newName && person.number === newNum)) {
      alert(`${newName} is already added to phonebook with same number ${newNum}`)
    }
    else if(persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook with different number`)
    }
    else if(persons.some(person => person.number === newNum)) {
      alert(`${newNum} is already added to phonebook with different name`)
    }
    else{
      addPersonToServer(newPerson)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    setNewNum(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const filteredpersons = persons.filter(person => 
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} 
      newName={newName} 
      handleNameChange={handleNameChange} 
      newNum={newNum} 
      handleNumChange={handleNumChange}/>
      <h2>Numbers</h2>
      <Persons filteredpersons={filteredpersons} />
    </div>
  )
}

export default App