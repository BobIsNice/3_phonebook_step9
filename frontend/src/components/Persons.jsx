import React from "react";

const Persons = ({ personsToShow, handleDelete}) => {
    return (
        <div>
          {personsToShow.map((name, index) => (
            <p key={index}>  {name.name} {name.number} <button onClick={() => handleDelete(name.id)}>delete</button> </p> 
            
        ))}

            
        </div>
    )
}

export default Persons