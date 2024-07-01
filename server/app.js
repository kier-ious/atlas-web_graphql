const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema.js');

const app = express();

app.use('/graphql',graphqlHTTP({
  schema,
  // This here enables the GraphIQL interface
  graphiql: true,
}));

app.listen(4000,()=>{
  console.log('now listening for request on port 4000');
});

// add comment
