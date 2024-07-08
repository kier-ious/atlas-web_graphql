import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GET_PROJECTS_QUERY, ADD_PROJECT_MUTATION } from '../queries/queries';


function AddProject(props) {
  const [addProject] = useMutation(ADD_PROJECT_MUTATION);

  const [inputs, setInputs] = useState({
    title: '',
    weight: 1,
    description: ''
  });

  const handleChange = (e) => {
    const newInputs = { ...inputs };
    if (e.target.name === "weight") {
      newInputs[e.target.name] = parseInt(e.target.value);
    } else {
      newInputs[e.target.name] = e.target.value;
    }
    setInputs(newInputs);
  };

  const submitForm = (e) => {
    e.preventDefault();
    addProject({
      variables: {
        title: inputs.title,
        weight: inputs.weight,
        description: inputs.description
      },
      refetchQueries: [{ query: GET_PROJECTS_QUERY }]
    });
  };

  return (
    <form className="project" id="add-project" onSubmit={submitForm}>
      <div className="field">
        <label>Project title:</label>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          value={inputs.title}
          required
        />
      </div>
      <div className="field">
        <label>Weight:</label>
        <input
          type="number"
          name="weight"
          onChange={handleChange}
          value={inputs.weight}
          required
        />
      </div>
      <div className="field">
        <label>Description:</label>
        <textarea
          name="description"
          onChange={handleChange}
          value={inputs.description}
          required
        />
      </div>
      <button>+</button>
    </form>
  );
}

export default AddProject;
