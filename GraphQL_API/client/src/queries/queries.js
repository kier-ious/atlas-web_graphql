import { gql } from 'apollo-boost';

// Tasks Query
export const GET_TASKS_QUERY = gql`
  {
    tasks {
      id
      title
    }
  }
`;

// Projects Query
export const GET_PROJECTS_QUERY = gql`
  {
    projects {
      id
      title
    }
  }
`;

// Add Task Mutation
export const ADD_TASK_MUTATION = gql`
  mutation($title: String!, $weight: Int!, $description: String!, $projectId: ID!) {
    addTask(title: $title, weight: $weight, description: $description, projectId: $projectId) {
      id
      title
    }
  }
`;

// Add Project Mutation
export const ADD_PROJECT_MUTATION = gql`
  mutation($title: String!, $weight: Int!, $description: String!) {
    addProject(title: $title, weight: $weight, description: $description) {
      id
      title
    }
  }
`;

// Task Detail Query
export const GET_TASK_DETAIL_QUERY = gql`
  query($id: ID!) {
    task(id: $id) {
      id
      title
      weight
      description
      project {
        id
        title
        weight
        description
        tasks {
          id
          title
          weight
        }
      }
    }
  }
`;
