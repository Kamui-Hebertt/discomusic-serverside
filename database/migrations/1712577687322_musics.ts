import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Music extends BaseSchema {
  protected tableName = 'musics'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').nullable()
      table.string('artist').nullable()
      table.string('url').nullable()
      table.string('file').nullable()
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
