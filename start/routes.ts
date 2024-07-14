/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const TikShopsController = () => import('#controllers/tik_shops_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('tikthop-scrapper', [TikShopsController, 'scrapper'])
