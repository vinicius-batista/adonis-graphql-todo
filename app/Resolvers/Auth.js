'use strict'

const User = use('App/Models/User')

module.exports = {
  Mutation: {
    registerUser: async (_, { input }) => {
      await User.create(input)
      return 'User registred successfully.'
    },
    loginUser: async (_, { input }, { auth }) => {
      const { email, password } = input
      return auth
        .withRefreshToken()
        .attempt(email, password)
    }
  },
  Query: {
    newToken: (_, { refreshToken }, { auth }) => auth.generateForRefreshToken(refreshToken)
  }
}