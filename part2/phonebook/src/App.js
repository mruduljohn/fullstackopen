import { useState } from 'react'

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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' , number: '040-123456' , id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
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
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewNum('')
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