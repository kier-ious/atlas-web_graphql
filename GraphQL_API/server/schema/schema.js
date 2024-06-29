// adding random comment to see if this works

const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

// Define the TaskType
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString }
  }
});

// Define the RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // Resolve function to get the data
        // For now, we can return a mock object
        return { id: args.id, title: 'Sample Task', weight: 5, description: 'This is a sample task.' };
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
