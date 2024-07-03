const _ = require('lodash');
const mongoose = require('mongoose'); // Make sure mongoose is required

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

// Define Task and Project models using Mongoose
const Task = require('../models/task');
const Project = require('../models/project');

// TaskType definition
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve(parent, args) {
        // Assuming you have ProjectType defined below
        return Project.findById(parent.projectId); // Use Mongoose to find project by ID
      }
    }
  })
});

// ProjectType definition
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find({ projectId: parent.id }); // Use Mongoose to find tasks by projectId
      }
    }
  })
});

// Mutation definition
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let project = new Project({
          title: args.title,
          weight: args.weight,
          description: args.description,
        });
        return project.save(); // Save project to MongoDB
      },
    },
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        projectId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let task = new Task({
          title: args.title,
          weight: args.weight,
          description: args.description,
          projectId: args.projectId,
        });
        return task.save(); // Save task to MongoDB
      },
    },
  },
});

// RootQuery definition
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Task.findById(args.id); // Use Mongoose to find task by ID
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id); // Use Mongoose to find project by ID
      }
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find({}); // Use Mongoose to find all tasks
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find({}); // Use Mongoose to find all projects
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation // Add Mutation to the GraphQL schema
});
