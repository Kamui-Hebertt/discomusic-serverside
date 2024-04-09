import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Music from './Music'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  public static table = 'users'
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public nickname: string

  @column()
  public email: string

  @column()
  public password: string


  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }


  @hasMany(() => Music)
  public music: HasMany<typeof Music>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
