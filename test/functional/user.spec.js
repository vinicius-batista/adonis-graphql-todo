'use strict'

const { test, trait, before, after } = use('Test/Suite')('User')
const User = use('App/Models/User')
const Todo = use('App/Models/Todo')

trait('Test/ApiClient')
trait('Auth/Client')

before(async () => {
  const user = await User.create({
    username: 'test',
    email: 'test',
    password: 'test'
  })
  await user
    .todos()
    .createMany([
      {
        text: 'this is a test todo'
      },
      {
        text: 'this is a test todo 2'
      }
    ])
})

after(async () => {
  await Todo.query().delete()
  await User.query().delete()
})

test('query own user info', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test')
  const query = `query {
    ownInfo {
      id,
      username,
      email
    }
  }`

  const response = await client
    .post('/graphql')
    .send({ query })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  const { id, username, email } = JSON.parse(response.text).data.ownInfo
  assert.equal(email, 'test')
  assert.equal(username, 'test')
  assert.exists(id)  
})

test('query own user info with todos', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test')
  const query = `query {
    ownInfo {
      id,
      username,
      email,
      todos {
        id,
        text,
        completed
      }
    }
  }`

  const response = await client
    .post('/graphql')
    .send({ query })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  const { id, username, email, todos } = JSON.parse(response.text).data.ownInfo
  assert.equal(email, 'test')
  assert.equal(username, 'test')
  assert.exists(id)

  const todosToTest = [
    { text: 'this is a test todo', completed: false },
    { text: 'this is a test todo 2', completed: false } 
  ]
  todosToTest.forEach((todo, index) => {
    assert.equal(todos[index].text, todo.text)
    assert.equal(todos[index].completed, todo.completed)
  })
})

test('update user info', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test')
  const emailUpdate = 'test 2'
  const usernameUpdate = 'test username'
  const input = {
    email: emailUpdate,
    username: usernameUpdate
  }
  const query = `mutation ($input: UpdateUserInput) {
    updateUser(input: $input) {
      username,
      email
    }
  }
  `

  const response = await client
    .post('/graphql')
    .send({ query, variables: { input } })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  const { username, email } = JSON.parse(response.text).data.updateUser
  assert.equal(email, emailUpdate)
  assert.equal(username, usernameUpdate)
})

test('delete user', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test 2')

  const query = `mutation {
    deleteUser
  }`

  const response = await client
    .post('/graphql')
    .send({ query })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  const { deleteUser } = JSON.parse(response.text).data
  assert.equal('User deleted successfully.', deleteUser)
})
