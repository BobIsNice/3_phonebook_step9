import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'
import personsService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearchName, setNewSearchName] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  useEffect(() => {
    console.log('effect')
    axios.get('https://three-phonebook-step9-1.onrender.com/api/persons').then((response) => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
  }, [])
  console.log('render', persons.length, 'persons')

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    
    if (persons.map(person => person.name).includes(newName)) {
      
      
      if (window.confirm(`${newName} is already added to phonebook, replace old number with a new one?`)) {
        const id = persons.find(p => p.name === newName).id
        const personObject = {
          name: newName,
          number: newNumber,
          id: id
        }
        
        personsService.update(id, personObject).then((returnedPerson) => {
          setPersons(persons.map(p => p.id !== id ? p : returnedPerson))

          setSuccessMessage(`New number for ${returnedPerson.name} updated successfully`)
          setTimeout(() => {
          setSuccessMessage(null)
          }, 5000)
        })}


      setNewName('')
      setNewNumber('')   
    }
    else if (newName === '') {
      alert('Please enter a name')
    }else{
      const personObject = {
        name: newName,
        number: newNumber,
        id: '' + (persons.length + 1)
      }

      personsService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')

        setSuccessMessage(`Added ${returnedPerson.name} successfully`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
    }
  }

  const handleNameChange = (event) => {    
    console.log(event.target.value)    
    setNewName(event.target.value)  
  }

  const handleNumberChange = (event) => {    
    console.log(event.target.value)    
    setNewNumber(event.target.value)  
  }

  const handleSearchName = (event) => {    
    console.log(event.target.value)    
    setNewSearchName(event.target.value)
    event.preventDefault()
  }
 
  const handleDelete = (id) => {
    const personNameToDelete = persons.find(p => p.id === id).name
    if (window.confirm(`Delete ${personNameToDelete} ?`)) {
      
      personsService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        setErrorMessage(`Information of ${personNameToDelete} has already been removed from server`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newSearchName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} type={"success"}/>
      <Notification message={errorMessage} type={"error"}/>
      <Filter value={newSearchName} onChange={handleSearchName}/>

      <h2>Add a new</h2>

      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>

      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
        
    </div>
  )
}

export default App