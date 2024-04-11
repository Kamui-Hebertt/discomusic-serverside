import Hash from '@ioc:Adonis/Core/Hash'
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



  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      // Find the user by email
      const user = await User.findBy('email', email)

      if (!user) {
        return response.unauthorized('E-mail ou senha inválidos')
      }





      // Compare the provided plaintext password with the hashed password in the database
      const passwordValid = await Hash.verify(user.password, password)

      if (!passwordValid) {
        return response.unauthorized('Senha inválida')
      }
      const expiresIn = 9 * 365 * 999 * 999 * 9 * 10 // 2 hours

      // Use the auth API to generate a token for the user
      const token = await auth.use('api').login(user, { expiresIn })

      console.log(token)
      return response.status(200).json({
        userId: user.id,
        user: user.name,

        email: user.email,

        token: token.token,

        expiresIn: token.expiresIn,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Internal Server Error' })
    }
  }








  public async checkTokenAuth({ auth, response }) {
    try {

      await auth.check()

      // User is authenticated, return success response
      return response.json({ status: 'success', message: 'User is logged in' })
    } catch (error) {
      // User is not authenticated, return error response
      return response.status(401).json({ status: 'error', message: 'Unauthorized' })
    }
  }




  public async logout({ auth, response }: HttpContextContract) {
    try {

      const auth1 = await auth.use('api').logout()
      console.log(auth1)
      return response.status(200).json({ message: 'Logout successful' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Internal Server Error' })
    }
  }

}
