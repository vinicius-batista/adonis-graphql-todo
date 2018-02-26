'use strict'

module.exports = {
  Query: {
    todos: async (_, values, { auth }) => {
      const user = await auth.getUser()
      const todos = await user.todos().fetch()
      return todos.toJSON()
    }
  },
  Mutation: {
    createTodo: async (_, { input }, { auth }) => {
      const user = await auth.getUser()
      const todo = await user.todos().create(input)
      await todo.reload()
      return todo
    },
    updateTodo: async (_, { input }, { auth }) => {
      const { id } = input
      const user = await auth.getUser()

      const todo = await user
        .todos()
        .where('id', id)
        .first()

      todo.merge(input)
      await todo.save()
      
      return todo
    },
    deleteTodo: async (_, { input }, { auth }) => {
      const { id } = input
      const user = await auth.getUser()

      const todo = await user
        .todos()
        .where('id', id)
        .first()
      await todo.delete()
      
      return 'Todo deleted successfully'
    }
  }
}
