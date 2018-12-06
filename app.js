const {ApolloServer, gql} = require('apollo-server');
const resolvers = require('./resolvers');

const typeDefs = gql`
  type News {
    title: String
    author: String
    content: String
  }

  type Food {
    id: String
    name: String
    amount: Int
    unit: String
  }

  type Todo {
    id: String
    checked: Boolean
    name: String
  }

  type Recipies {
    id: String
    name: String
    cooktime: Int
    food: [Food]
  }

  type Query {
    news: [News]

    todo: [Todo]

    food: [Food]

    recipies: [Recipies]
  }

  type Mutation {
    login(email: String!, password: String!): String

    register(email: String!, password: String!): String

    todoCheck(uuid: String, value: Boolean): Boolean
  }
`;

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
