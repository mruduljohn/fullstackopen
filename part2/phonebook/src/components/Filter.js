import React from 'react';

const Filter = ({ newfilter, handleFilterchange }) => (
  <div>
    <form>
      <div>
        filter shown with <input 
          value={newfilter} 
          onChange={handleFilterchange}
        />
      </div>
    </form>
  </div>
)

export default Filter;