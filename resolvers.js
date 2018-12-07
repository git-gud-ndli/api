const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v1");
const models = require("./models");
const axios = require("axios");
const geoip = require("geoip-lite");

const secret = process.env.JWT_SECRET;

const expose = item => Object.assign(item, item.serialize({ shallow: true }));

module.exports = {
  Query: {
    todo: (_, { id }) =>
      models.TodoItem.where("id", id)
        .fetch()
        .then(expose),
    todoList: (_, { id }) =>
      models.TodoList.where("id", id)
        .fetch()
        .then(expose),
    user: (_, { id }) =>
      models.User.where("id", id)
        .fetch()
        .then(expose),
    me: async (_, {}, { dataSources, authenticated, user }) => {
      if (authenticated) return expose(user);
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
    weather: async (_, { lat, long }, ctx) => {
      return await axios
        .get(
          `https://api.darksky.net/forecast/${
            process.env.WEATHER_API_KEY
          }/${lat},${long}`,
        )
        .then(function(response) {
          let {
            humidity,
            temperature,
            ozone,
            windSpeed,
            summary,
            icon,
          } = response.data.currently;
          if (!response.data.alerts) response.data.alerts = [];
          response.data.alerts.map(a => {
            delete a.uri;
          });
          return {
            humidity,
            temperature,
            ozone,
            windSpeed,
            summary,
            icon,
            alerts: response.data.alerts,
          };
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    food: async (_, {}, ctx) => {
      let req = await axios.get(
        'http://prom:9090/api/v1/query?query={user%3D"jean"}',
      );
      let res = [];
      req.data.data.result.map(e => {
        res.push({ amount: e.value[1], name: e.metric.__name__ });
      });

      return res;
    },
  },
  User: {
    lists: (parent, {}, ctx, info) =>
      parent
        .related(info.fieldName)
        .fetch()
        .then(c => c.map(expose)),
  },
  TodoList: {
    owner: (parent, {}, ctx, info) => expose(parent.related(info.fieldName)),
    items: (parent, {}, ctx, info) =>
      parent
        .related(info.fieldName)
        .fetch()
        .then(c => c.map(expose)),
  },
  TodoItem: {
    list: (parent, {}, ctx, info) => expose(parent.related(info.fieldName)),
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
    updateTodoItem: async (_, { id, input }, { dataSources }) => {
      const todo = await models.TodoItem.where({ id }).fetch();
      todo.set(input);
      return todo.save().then(expose);
    },
    updateCoords: async (_, { lat, long }, { dataSources }) => {
      return true;
    },
    createTodoList: async (_, { name, items }, { user }) => {
      const list = await new models.TodoList({
        name,
        owner_id: user.get("id"),
      }).save();
      await models.TodoItems.forge(
        items.map(item => ({
          ...item,
          checked: false,
          list_id: list.get("id"),
        })),
      ).invokeThen("save", null);
      return list;
    },
    createTodoItem: async (_, { listId, item }, { user }) => {
      return new models.TodoItem({
        ...item,
        checked: false,
        list_id: listId,
      })
        .save()
        .then(expose);
    },
  },
};
