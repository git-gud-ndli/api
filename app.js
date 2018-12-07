const { ApolloServer, gql } = require("apollo-server");
const jwt = require("jsonwebtoken");
const resolvers = require("./resolvers");
const models = require("./models");

const typeDefs = gql`
  type User {
    id: String
    created_at: String
    updated_at: String
    username: String
    email: String
    lists: [TodoList]
  }

  type TodoItem {
    id: String
    created_at: String
    updated_at: String
    list: TodoList
    checked: Boolean
    name: String
  }

  type TodoList {
    id: String
    created_at: String
    updated_at: String
    name: String
    items: [TodoItem]
    owner: User
  }

  type News {
    url: String
    title: String
    publishedAt: String
    content: String
  }

  type Alert {
    title: String
    regions: [String]
    severity: String
    time: Int
    expires: Int
    description: String
  }
  type Weather {
    temperature: Float
    humidity: Float
    ozone: Float
    windSpeed: Float
    summary: String
    icon: String
    alerts: [Alert]
  }

  type Food {
    name: String
    amount: Int
  }

  type Query {
    todo(id: String): TodoItem
    todoList(id: String): TodoList

    me: User
    user(id: String): User

    news: [News]

    weather(lat: Float!, long: Float!): Weather

    food: [Food]
  }

  input TodoItemParam {
    name: String
    checked: Boolean
  }

  type Mutation {
    login(email: String!, password: String!): String

    register(email: String!, password: String!): String

    updateTodoItem(id: String, input: TodoItemParam): TodoItem

    updateCoords(lat: String, long: String): Boolean

    createTodoList(name: String!, items: [TodoItemParam]): TodoList

    createTodoItem(listId: String!, item: TodoItemParam!): TodoItem
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
          user,
          headers: req.headers,
        };
      }
    }

    return { authenticated: false, headers: req.headers };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
