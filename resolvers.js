const jwt = require("jsonwebtoken");
const secret = "La bonne phrase";
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v1");
const models = require("./models");

const data = {
  me: {
    id: uuid(),
    username: "robert",
    lists: [
      {
        id: uuid(),
        items: [
          {
            id: uuid(),
            checked: false,
            name: "Laver le chamal"
          },
          {
            id: uuid(),
            checked: true,
            name: "Acheter une poule"
          },
          {
            id: uuid(),
            checked: false,
            name: "Vendre le chat"
          }
        ],

        owner: null
      },
      {
        id: uuid(),
        items: [
          {
            id: uuid(),
            checked: false,
            name: "Foo"
          }
        ],

        owner: null
      }
    ]
  }
};

const lists = data.me.lists;
const todos = [].concat(...lists.map(l => l.items));

for (const list of lists) {
  list.owner = data.me;
}

module.exports = {
  Query: {
    todo: async (_, { id }, { dataSources }) => {
      return todos.find(t => t.id === id);
    },
    todoList: async (_, { id }, { dataSources }) => {
      return lists.find(l => l.id === id);
    },
    user: async (_, { id }, { dataSources }) => {
      if (id === data.me.id) return data.me;
      return null;
    },
    me: async (_, {}, { dataSources }) => {
      return data.me;
    }
  },
  Mutation: {
    login: async (_, { email, password }, { dataSources }) => {
      try {
        const user = await models.User.where({
          email
        }).fetch();

        if (!(await bcrypt.compare(password, user.get("password")))) {
          throw new Error("bad credentials");
        }

        return jwt.sign(
          {
            uid: user.get("id"),
            iat: Math.floor(Date.now() / 1000) - 30,
            exp: Math.floor(Date.now() / 1000) + 7200 // 2 hours validity
          },
          secret
        );
      } catch (e) {
        throw new Error("login failed");
      }
    },
    register: async (_, { email, password }, { dataSources }) => {
      const hash = bcrypt.hashSync(password, 8);

      try {
        const user = await new models.User({
          username: email,
          name: email,
          email,
          password: hash
        }).save();
        return jwt.sign(
          {
            uid: user.get("id"),
            iat: Math.floor(Date.now() / 1000) - 30,
            exp: Math.floor(Date.now() / 1000) + 7200 // 2 hours validity
          },
          secret
        );
      } catch (e) {
        throw new Error("could not create user: it may already exists");
      }
    },
    todoCheck: async (_, { uuid, value }, { dataSources }) => {
      const todo = await models.Todo.where({ id: uuid }).fetch();
      todo.checked = value;
      todo.save();
      return true;
    },
    updateCoords: async (_, { lat, long }, { dataSources }) => {
      return true;
    }
  }
};
