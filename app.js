const {ApolloServer, gql} = require('apollo-server');
const resolvers = require('./resolvers');

const typeDefs = gql`
  type User {
    id: String
    username: String
    lists(first: Int, after: String): [TodoList]
  }

  type TodoItem {
    id: String
    checked: Boolean
    name: String
  }

  type TodoList {
    id: String
    items: [TodoItem]
    owner: User
  }

  type Query {
    todo(id: String): TodoItem
    todoList(id: String): TodoList

    me: User
    user(id: String): User
  }

  type Mutation {
    login(email: String!, password: String!): String

    register(email: String!, password: String!): String

    todoCheck(uuid: String, value: Boolean): Boolean

    updateCoords(lat: String, long: String): Boolean
  }
`;

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
