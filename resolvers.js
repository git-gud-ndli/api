const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const secret = 'La bonne phrase';
const bcrypt = require('bcryptjs');
const uuid = require("uuid/v1");

const pg = require('knex')(require('./knexfile').development);
=======
const uuid = require('uuid/v1');
const secret = 'La bonne phrase';

var pg = require('knex')(require('./knexfile').development);
>>>>>>> d2d7a177717dddc9bbf0222867bcc3087899252e

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
<<<<<<< HEAD
    login: async (_, { email, password }, { dataSources }) => {
      const hash = bcrypt.hashSync(password, 8);
      const users = await pg('users').where({
        email,
      });
      if (users.length < 1) throw new Error('user not found');
      const user = users[0];
      if (! await bcrypt.compare(password, user.password)) {
        throw new Error('bad credentials');
      }

=======
    login: async (_, {email, password}, {dataSources}) => {
>>>>>>> d2d7a177717dddc9bbf0222867bcc3087899252e
      return jwt.sign(
        {
          uid: user.id,
          iat: Math.floor(Date.now() / 1000) - 30,
          exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours validity
        },
        secret,
      );
    },
<<<<<<< HEAD
    register: async (_, { email, password }, { dataSources }) => {
      const hash = bcrypt.hashSync(password, 8);
      const user = await pg('users').insert({
        username: email,
        name: email,
        email,
        password: hash,
      });

      if (!user) throw new Error('could not create user');

=======
    register: async (_, {email, password}, {dataSources}) => {
>>>>>>> d2d7a177717dddc9bbf0222867bcc3087899252e
      return jwt.sign(
        {
          uid: user.id,
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
