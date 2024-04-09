import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Music extends BaseSchema {
  protected tableName = 'musics'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.string('artist').notNullable()
      table.string('url').notNullable()
      table.string('file').notNullable()
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
