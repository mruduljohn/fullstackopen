import React from 'react';

const Filter = ({ newfilter, handleFilterChange }) => (
  <div>
    <form>
      <div>
        filter shown with <input 
          value={newfilter} 
          onChange={handleFilterChange}
        />
      </div>
    </form>
  </div>
)

export default Filter;