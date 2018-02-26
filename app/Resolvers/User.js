'use strict'

module.exports = {
  Query: {
    ownInfo: (_, values, { auth }) => auth.getUser()
  },
  Mutation: {
    updateUser: async (_, { input }, { auth }) => {
      const { email, username } = input
      const user = await auth.getUser()
      user.merge({ email, username })
      await user.save()

      return user
    },
    deleteUser: async (_, values, { auth }) => {
      const user = await auth.getUser()
      await user.delete()
      return 'User deleted successfully.'
    }
  }
}