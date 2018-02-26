'use strict'

const Schema = use('Schema')

class TodoSchema extends Schema {
  up () {
    this.create('todos', (table) => {
      table.increments()
      table.timestamps()
      table.integer('userId').unsigned().references('id').inTable('users')
      table.string('text').notNullable()
      table.boolean('completed').defaultTo(false)
    })
  }

  down () {
    this.drop('todos')
  }
}

module.exports = TodoSchema
