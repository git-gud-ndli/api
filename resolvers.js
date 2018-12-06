const jwt = require('jsonwebtoken');
const uuid = require('uuid/v1');
const secret = 'La bonne phrase';

var pg = require('knex')(require('./knexfile').development);

const data = {
  me: {
    id: uuid(),
    username: 'robert',
    lists: [
      {
        id: uuid(),
        items: [
          {
            id: uuid(),
            checked: false,
            name: 'Laver le chamal',
          },
          {
            id: uuid(),
            checked: true,
            name: 'Acheter une poule',
          },
          {
            id: uuid(),
            checked: false,
            name: 'Vendre le chat',
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
            name: 'Foo',
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
    todo: async (_, {id}, {dataSources}) => {
      return todos.find(t => t.id === id);
    },
    todoList: async (_, {id}, {dataSources}) => {
      return lists.find(l => l.id === id);
    },
    user: async (_, {id}, {dataSources}) => {
      if (id === data.me.id) return data.me;
      return null;
    },
    me: async (_, {}, {dataSources}) => {
      return data.me;
    },
  },
  Mutation: {
    login: async (_, {email, password}, {dataSources}) => {
      return jwt.sign(
        {
          email,
          password,
          iat: Math.floor(Date.now() / 1000) - 30,
          exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours validity
        },
        secret,
      );
    },
    register: async (_, {email, password}, {dataSources}) => {
      return jwt.sign(
        {
          email,
          password,
          iat: Math.floor(Date.now() / 1000) - 30,
          exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours validity
        },
        secret,
      );
    },
    todoCheck: async (_, {uuid, value}, {dataSources}) => {
      await pg('todos')
        .where('id', uuid)
        .update({
          checked: value,
        });
      return true;
    },
    updateCoords: async (_, {lat, long}, {dataSources}) => {
      return true;
    },
  },
};
