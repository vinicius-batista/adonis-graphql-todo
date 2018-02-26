'use strict'

const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.hashPassword')
  }

  static get hidden () {
    return ['password']
  }

  tokens () {
    return this.hasMany('App/Models/Token', 'id', 'userId')
  }

  todos () {
    return this.hasMany('App/Models/Todo', 'id', 'userId')
  }
}

module.exports = User
