import { Router, Request, Response } from 'express'
import axios from 'axios'

const router = Router()

router.get('/:url_id', async (req: Request, res: Response) => {
	try {
		const urlRecord = (
			await db.Url().findOne({ where: { short: req.params.url_id } })
		)?.toJSON()
		if (urlRecord) {
			const clientInfo = (await axios.get(`http://ipwho.is/${req.ip}`))
				.data
			const log = await db.Log().create({
				url_id: urlRecord.id,
				ip: clientInfo.ip,
				city: clientInfo.city,
				region: clientInfo.region,
				postal: clientInfo.postal,
				country: clientInfo.country,
				time_zone: clientInfo.timezone?.id,
			})
			res.redirect(urlRecord.target)
		} else {
			res.redirect('/404')
		}
	} catch (err: any) {
		res.status(500).json({ error: err.message })
	}
})

export default router
