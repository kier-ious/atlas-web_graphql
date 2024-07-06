const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema.js');
const cors = require('cors');

const app = express();

// This allows for cross-origin requests
app.use(cors());

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://kierstiemcalister:B3JesO6eD0gfnFBC@firstmongo123.fi8bewg.mongodb.net/?retryWrites=true&w=majority&appName=firstmongo123';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Add an event listener to log when the connection is open
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB Atlas:', err);
});

// Require models
const Task = require('./models/task');
const Project = require('./models/project');

// Setup GraphQL
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,  // Enable GraphiQL
}));

// Start the server
app.listen(4000, () => {
  console.log('Now listening for requests on port 4000');
});

// adding a little comment to push
