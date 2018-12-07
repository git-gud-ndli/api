const { ApolloServer, gql } = require("apollo-server");
const jwt = require("jsonwebtoken");
const resolvers = require("./resolvers");
const models = require("./models");

const typeDefs = gql`
  type User {
    id: String
    username: String
    lists: [TodoList]
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const header = req.headers.authorization || "";

    if (header) {
      const s = header.split(" ");
      if (s.length == 2 && s[0] == "Bearer") {
        const token = s[1];
        if (!jwt.verify(token, process.env.JWT_SECRET))
          throw new Error("Invalid token");

        const content = jwt.decode(token);
        const user = await models.User.where("id", content.uid).fetch();
        return {
          authenticated: true,
          user
        };
      }
    }

    return { authenticated: false };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
