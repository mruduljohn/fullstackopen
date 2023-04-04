import React,{ useState , useEffect } from 'react'
import axios from 'axios'
import Alert from './components/Alert'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const getAllhook = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error(error)
      })
  }

  useEffect(getAllhook, [])

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