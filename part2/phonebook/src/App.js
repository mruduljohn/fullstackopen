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

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button click', event.target)
    const newPerson = { name: newName , number: newNum }
    
    const checkPerson = persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase())
    if(checkPerson && checkPerson.number === newNum) {
        Alert(newPerson)
    }
    if(checkPerson && checkPerson.number !== newNum) {
        const confirmneNum = window.confirm(`${checkPerson.name} is already added to phonebook, do you want to replace the old number with a new one?`)
        if(confirmneNum) {
            const UpdatedPerson = { ...checkPerson, number: newNum }  
            personService
              .update(checkPerson.id, UpdatedPerson)
              .then(returnedPerson => {
                setPersons(persons.map(person => person.id !== checkPerson.id ? person : returnedPerson))
                setNotification(`Updated ${checkPerson.name}`)
                setTimeout(() => {
                  setNotification(null),4000)
                })
              }
    }

    if(!checkPerson) {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
        .catch(error =>{
          setNotification({
            text : error.response.data.error,
            type: 'error'
          })
          setTimeout(() =>{
            setNotification(null)},4000)
          })
          setNotification({
            text:`${newPerson.name} added to phonebook`,
            type:'notification'
          })
          setTimeout(() =>{
            setNotification(null)},4000)
          }
          setNewName('')
          setNewNum('')
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