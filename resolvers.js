const jwt = require('jsonwebtoken');
const secret = 'La bonne phrase';

module.exports = {
  Query: {
    news: async (_, {email}, {dataSources}) => {
      return [
        {title: 'le bon titre', author: 'Paul', content: 'Le bon contenu'},
      ];
    },
    todo: async (_, {email}, {dataSources}) => {
      return [
        {
          id: 'fezfezf-zfzefzefez-fzf',
          checked: false,
          name: 'Laver le chamal',
        },
        {
          id: 'ffzfezf-zfzefzefez-fzf',
          checked: true,
          name: 'Acheter une poule',
        },
        {
          id: 'feoiezf-zfzefzefez-fzf',
          checked: false,
          name: 'Vendre le chat',
        },
      ];
    },
  },
  Mutation: {
    login: async (_, {email}, {dataSources}) => {
      return jwt.sign({email, iat: Math.floor(Date.now() / 1000) - 30}, secret);
    },
    loginotp: async (_, {token}, {dataSources}) => {
      return jwt.sign(
        {
          user: 'jean',
          group: 'member',
          refresh: jwt.sign(
            {timeout: Math.floor(Date.now() / 1000) - 30},
            secret,
          ),
          iat: Math.floor(Date.now() / 1000) - 30,
        },
        secret,
      );
    },
  },
};
