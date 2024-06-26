/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
}).prefix('/api')


Route.group(()=> {

  Route.post('/registerNewUser', 'UsersController.registerUser')

  Route.post('/login', 'UsersController.login')


  Route.post('/logout', 'UsersController.logout').middleware('auth')


  Route.get('/checkLogin', 'UsersController.checkTokenAuth').middleware('auth')



  Route.get('/music/user/:userId', 'MusicsController.listMusicByUserId');
  Route.get('/music/all', 'MusicsController.listAllMusic');


  Route.post('/createMusicWithoutFile', 'MusicsController.createMusicWithoutFile')

  Route.post('/uploadNewMusic/:musicId', 'MusicsController.uploadFileForMusic')

  Route.delete('/deleteSong/:musicId', 'MusicsController.deleteMusicById')

}).prefix('/api')

