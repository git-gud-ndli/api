const jwt = require('jsonwebtoken');
const secret = 'La bonne phrase';

module.exports = {
  Query: {
    news: async (_, {}, {dataSources}) => {
      return [
        {title: 'le bon titre', author: 'Paul', content: 'Le bon contenu'},
      ];
    },
    todo: async (_, {}, {dataSources}) => {
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
    food: async (_, {}, {dataSources}) => {
      return [
        {
          id: 'feoiezf-zfzefzefez-fzf',
          name: 'Pain',
          amount: 25,
          unit: 'g',
        },
        {
          id: 'ffziezf-zfzefzefez-fzf',
          name: 'Cigarette',
          amount: 65,
          unit: null,
        },
        {
          id: 'fyuipozf-zfzefzefez-fzf',
          name: 'Café',
          amout: 67000,
          unit: 'g',
        },
      ];
    },
    recipies: async (_, {}, {dataSources}) => {
      return [
        {
          id: 'feoiezf-zfzefzefez-fzf',
          name: 'Crepe',
          food: [
            {
              id: 'fezezezef-ibhbihbihb',
              name: 'pain',
              amount: 13456,
            },
          ],
        },
      ];
    },
  },
  Mutation: {
    login: async (_, {email, password}, {dataSources}) => {
      return jwt.sign({
        email, 
        iat: Math.floor(Date.now() / 1000) - 30,
        exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours validity
      }, secret);
    },
    register: async (_, {email, password}, {dataSources}) => {
      return jwt.sign({
        email, 
        iat: Math.floor(Date.now() / 1000) - 30,
        exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours validity
      }, secret);
    },
    todoCheck: async (_, {uuid, value}, {dataSources}) => {
      return true;
    },
  },
};
