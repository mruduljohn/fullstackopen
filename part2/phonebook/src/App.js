import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' , number: '9999999999' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')

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


  return (
    <div>
      <h2>Phonebook</h2>
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

      <h2>Numbers</h2>
        <ul>
          {persons.map(person => (
            <li key={person.name}>
              {person.name} {person.number}
            </li>
          ))}
        </ul>
    </div>
  )
}

export default App