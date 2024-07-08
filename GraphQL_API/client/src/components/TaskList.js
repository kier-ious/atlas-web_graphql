import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import TaskDetails from './TaskDetails';
import { GET_TASKS_QUERY } from '../queries/queries';


const GET_TASKS_QUERY = gql`
  {
    tasks {
      id
      title
    }
  }
`;

function displayTasks(data, setState) {
  if (data.loading) {
    return <div>Loading tasks...</div>;
  } else if (data.error) {
    return <div>Error fetching tasks</div>;
  } else {
    return data.tasks.map(task => (
      <li key={task.id} onClick={() => setState({ selected: task.id })}>
        {task.title}
      </li>
    ));
  }
}

function TaskList() {
  const { loading, error, data } = useQuery(GET_TASKS_QUERY);
  const [state, setState] = useState({
    selected: null
  });

  return (
    <div>
      <ul id="task-list">
        {displayTasks({ loading, error, data }, setState)}
      </ul>
      <TaskDetails selectedTaskId={state.selected} />
    </div>
  );
}

// Adding a comment to push
export default TaskList;
