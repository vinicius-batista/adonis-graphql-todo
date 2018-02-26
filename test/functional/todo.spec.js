'use strict'

const { test, trait, before, after} = use('Test/Suite')('Todo')
const User = use('App/Models/User')
const Todo = use('App/Models/Todo')

trait('Test/ApiClient')
trait('Auth/Client')

before(async () => {
  await User.create({
    username: 'test',
    email: 'test',
    password: 'test'
  })
})

after(async () => {
  await Todo.query().delete()
  await User.query().delete()
})

test('create a todo', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test')
  const query = `mutation($input: CreateTodoInput) {
    createTodo (input: $input) {
      id,
      text,
      completed,
      userId
    }
  }`
  const variables = {
    input: {
      text: 'this is a test todo'
    }
  }

  const response = await client
    .post('/graphql')
    .send({ query, variables })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  const { id, text, completed, userId } = JSON.parse(response.text).data.createTodo
  assert.equal(user.id, userId)
  assert.isFalse(completed)
  assert.exists(id)
  assert.equal('this is a test todo', text)
})

test('fetch todos', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test')
  const query = `query {
    todos {
      id,
      text,
      completed
    }
  }`

  const response = await client
    .post('/graphql')
    .send({ query })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  const { todos } = JSON.parse(response.text).data
  assert.isArray(todos)
  assert.equal(todos[0].text, 'this is a test todo')
})

test('update a todo', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test')
  const todo = await user.todos().first()
  const query = `mutation($input: UpdateTodoInput) {
    updateTodo (input: $input) {
      id,
      text,
      completed,
      userId
    }
  }`
  const variables = {
    input: {
      id: todo.id,
      text: 'this is a test todo 2'
    }
  }

  const response = await client
    .post('/graphql')
    .send({ query, variables })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  const { id, text, completed, userId } = JSON.parse(response.text).data.updateTodo
  assert.equal(user.id, userId)
  assert.isFalse(completed)
  assert.equal(id, todo.id)
  assert.equal('this is a test todo 2', text)
})

test('delete a todo', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test')
  const todo = await user.todos().first()
  const query = `mutation($input: DeleteTodoInput) {
    deleteTodo (input: $input)
  }`
  const variables = {
    input: {
      id: todo.id
    }
  }

  const response = await client
    .post('/graphql')
    .send({ query, variables })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  const { deleteTodo } = JSON.parse(response.text).data
  assert.equal('Todo deleted successfully', deleteTodo)
})
