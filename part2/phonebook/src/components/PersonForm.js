import React from 'react';

const PersonForm = ({ addPerson, newName, handleNameChange, newNum, handleNumChange }) => (
  <div>
    <form onSubmit={addPerson}>
      <div>
        name: <input 
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: <input 
          value={newNum}
          onChange={handleNumChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </div>
)

export default PersonForm;