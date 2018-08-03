import { Router } from 'express'
import ocrController from './ocrController.js'

const router = new Router()

// router.route('/ocr/:image_name')
// .get(function(req, res, next) {
//   return 'OOOOK'
// })

router.get('/ocr/:image_name', ocrController)

export default router
