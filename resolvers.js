const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v1");
const models = require("./models");
const graphQLBookshelf = require("graphql-bookshelfjs");
const axios = require("axios");
const geoip = require("geoip-lite");

const secret = process.env.JWT_SECRET;

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
            name: "Laver le chamal",
          },
          {
            id: uuid(),
            checked: true,
            name: "Acheter une poule",
          },
          {
            id: uuid(),
            checked: false,
            name: "Vendre le chat",
          },
        ],

        owner: null,
      },
      {
        id: uuid(),
        items: [
          {
            id: uuid(),
            checked: false,
            name: "Foo",
          },
        ],

        owner: null,
      },
    ],
  },
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
    todoList: graphQLBookshelf.resolverFactory(models.Todo),
    user: graphQLBookshelf.resolverFactory(models.User),
    me: async (_, {}, { dataSources, authenticated, user }) => {
      if (authenticated) return data.me;
      return null;
    },
    news: async (_, {}, ctx) => {
      var geo = geoip.lookup(ctx.headers["x-forwarded-for"]);
      return await axios
        .get("https://newsapi.org/v2/top-headlines", {
          params: {
            country: geo.country,
            apiKey: process.env.NEWS_API_KEY,
          },
        })
        .then(function(response) {
          response.data.articles.map(a => {
            delete a.source;
            delete a.author;
            delete a.urlToImage;
          });
          return response.data.articles;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  User: {
    lists: graphQLBookshelf.resolverFactory(models.Todo),
  },
  TodoList: {
    owner: graphQLBookshelf.resolverFactory(models.User),
  },
  Mutation: {
    login: async (_, { email, password }, { dataSources }) => {
      try {
        const user = await models.User.where({
          email,
        }).fetch();

        if (!(await bcrypt.compare(password, user.get("password")))) {
          throw new Error("bad credentials");
        }

        return jwt.sign({ uid: user.get("id") }, secret, { expiresIn: "2h" });
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
          password: hash,
        }).save();
        return jwt.sign({ uid: user.get("id") }, secret, { expiresIn: "2h" });
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
    },
  },
};
