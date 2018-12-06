const {ApolloServer, gql} = require('apollo-server');
const resolvers = require('./resolvers');

const typeDefs = gql`
  type News {
    title: String
    author: String
    content: String
  }

  type Query {
    news: [News]
  }

  type Mutation {
    login(email: String): String

    loginotp(token: String): String
  }
`;

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
