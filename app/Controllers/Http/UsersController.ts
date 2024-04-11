import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"
import User from "App/Models/User"

export default class UsersController {



  public async registerUser({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()

    try {
      // Retrieve user data from the request
      const userData = request.only([
        'name',
        'email',
       'nickname',
       'password'
      ])
      const userData1 = request.all()

      console.log('Raw request data:', request.raw())
      console.log('All request data:', userData1)


      // Validate that email or cpf is present
      if (userData.email === undefined) {
        await trx.rollback()
        return response.status(400).json({ error: 'Email é obrigatório!' })
      }

      // Check if the user with the provided email already exists
      const existingUserByEmail = userData.email ? await User.findBy('email', userData.email) : null
      if (existingUserByEmail) {
        await trx.rollback()
        return response.status(400).json({ error: 'Já existe um usuário com esse Email' })
      }

      // Check if the user with the provided CPF already exists

      // Generate a verification token


      // Create a new user (within the transaction)
      const user =  await User.create(
        {
          ...userData,

        },
        { client: trx }
      )

      await trx.commit()

      return response.status(201).json({
        message: 'Cadastro realizado com sucesso!.',
        user: user,

      })

    } catch (error) {
      // Handle any errors that occur during user creation
      console.error(error)

      // Rollback the transaction in case of an error
      await trx.rollback()

      return response.status(500).json({ error: 'Erro interno' })
    }
  }

}
