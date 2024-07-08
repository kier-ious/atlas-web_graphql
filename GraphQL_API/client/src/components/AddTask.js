import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECTS_QUERY, GET_TASKS_QUERY, ADD_TASK_MUTATION } from '../queries/queries';


function displayProjects(data) {
  if (data.loading) {
    return <option>Loading projects...</option>;
  } else if (data.error) {
    return <option>Error loading projects</option>;
  } else {
    return data.projects.map(project => (
      <option key={project.id} value={project.id}>
        {project.title}
      </option>
    ));
  }
}

function AddTask() {
  const { loading, error, data } = useQuery(GET_PROJECTS_QUERY);
  const [addTask] = useMutation(ADD_TASK_MUTATION, {
    refetchQueries: [{ query: GET_TASKS_QUERY }]
  });

  const [inputs, setInputs] = useState({
    title: '',
    weight: 1,
    description: '',
    projectId: ''
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
    addTask({
      variables: {
        title: inputs.title,
        weight: inputs.weight,
        description: inputs.description,
        projectId: inputs.projectId
      }
    }).then(() => {

      setInputs({
        title: '',
        weight: 1,
        description: '',
        projectId: ''
      });
    }).catch(error => {
      console.error('Error adding task:', error);
    });
  };

  return (
    <form className="task" id="add-task" onSubmit={submitForm}>
      <div className="field">
        <label>Task title:</label>
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
      <div className="field">
        <label>Project:</label>
        <select
          name="projectId"
          onChange={handleChange}
          value={inputs.projectId}
          required
        >
          <option value="" disabled>Select project</option>
          {displayProjects({ loading, error, data })}
        </select>
      </div>
      <button>+</button>
    </form>
  );
}

export default AddTask;
