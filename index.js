const {ApolloServer, gql} = require('apollo-server');
const resolvers = require('./resolvers');

const typeDefs = gql`
  type News {
    title: String
    author: String
    content: String
  }

  type Todo {
    id: String
    checked: Boolean
    name: String
  }

  type Query {
    news: [News]

    todo: [Todo]
  }

  type Mutation {
    login(email: String, password: String): String

    register(email: String, password: String): String
  }
`;

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
