import React from 'react';
import { graphql } from 'react-apollo';
import { getTaskDetailQuery } from '../queries/queries';

function TaskDetails(props) {
  const { task } = props.data;

  function displayTaskDetails() {
    if (task) {
      return (
        <div>
          <h2>Title of task: {task.title}</h2>
          <p>Weight of the task: {task.weight}</p>
          <p>Title of the project: {task.project.title}</p>
          <p>All tasks of the project:</p>
          <ul className="other-tasks">
            {task.project.tasks.map(item => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </div>
      );
    } else {
      return <div>No task selected...</div>;
    }
  }

  return <div id="task-details">{displayTaskDetails()}</div>;
}

export default graphql(GET_TASK_DETAIL_QUERY, {
  options: (props) => ({
    variables: {
      id: props.taskId
    }
  })
})(TaskDetails);
