'use strict'

const { test, trait, after } = use('Test/Suite')('Auth')
const User = use('App/Models/User')
const Token = use('App/Models/Token')
const Encryption = use('Encryption')

trait('Test/ApiClient')
trait('Auth/Client')

after(async () => {
  await Token.query().delete()
  await User.query().delete()
})

test('register user', async ({ client, assert }) => {
  const query = `mutation($input: RegisterUserInput) {
    registerUser (input: $input)
  }`
  const variables = {
    input: {
      email: 'test',
      username: 'test',
      password: 'test',
    }
  }

  const response = await client
    .post('/graphql')
    .send({ query, variables })
    .end()

  response.assertStatus(200)
  const { registerUser } = JSON.parse(response.text).data
  assert.equal('User registred successfully.', registerUser)  
})

test('login user', async ({ client, assert }) => {
  const query = `mutation($input: LoginUserInput) {
    loginUser (input: $input) {
      token,
      refreshToken
    }
  }`
  const variables = {
    input: {
      email: 'test',
      password: 'test',
    }
  }

  const response = await client
    .post('/graphql')
    .send({ query, variables })
    .end()

  response.assertStatus(200)
  const { token, refreshToken } = JSON.parse(response.text).data.loginUser
  assert.exists(refreshToken)
  assert.exists(token)
})

test('user refresh token', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test')
  const refreshTokens = await Token.findBy('userId', user.id)
  const tokenEncrypt = Encryption.encrypt(refreshTokens.token)

  const query = `query($refreshToken: String!) {
    newToken (refreshToken: $refreshToken) {
      token,
      refreshToken
    }
  }`
  const variables = {
    refreshToken: tokenEncrypt
  }

  const response = await client
    .post('/graphql')
    .send({ query, variables })
    .end()

  response.assertStatus(200)
  const { token, refreshToken } = JSON.parse(response.text).data.newToken
  assert.exists(refreshToken)
  assert.exists(token)
})
