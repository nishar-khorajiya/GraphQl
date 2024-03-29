const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const morgan = require('morgan');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(isAuth);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,userId');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
})

//Query:- for get req fetching data and ,Mutation:-for put,update,delete data,also :-subscription,fragment

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.6fh8g6q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
  .then(() => {
    console.log("DB connected")
  }).catch(err => {
    console.log(err);
  })


app.listen(8000, (error) => {
  if (error) {
    console.log("Error in server");
  }
  else {
    console.log("app listening...");
  }
})