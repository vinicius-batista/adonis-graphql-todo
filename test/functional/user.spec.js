'use strict'

const { test, trait, before, after } = use('Test/Suite')('User')
const User = use('App/Models/User')

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
