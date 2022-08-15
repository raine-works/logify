import { Router, Request, Response } from 'express'
import { validate, Joi } from 'req-validator'

const router = Router()

router.post(
	'/create',
	validate(
		'body',
		Joi.object({
			target: Joi.string().uri(),
		})
	),
	async (req: Request, res: Response) => {
		try {
			const newUrl = await db.Url().create({ target: req.body.target })
			res.status(200).json(newUrl)
		} catch (err: any) {
			res.status(500).json({ error: err.message })
		}
	}
)

export default router
