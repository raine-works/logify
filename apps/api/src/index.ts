import { EventEmitter } from 'node:events'
import express, { Request, Response } from 'express'
import expressWs from 'express-ws'
import cors from 'cors'
import { getCliArguments, Args, setEnvs } from 'helpers'
import { DB, sqlEvent } from 'models'

/** Import route modules here */
import create from './routes/url.route'
import redirect from './routes/redirect.route'

/** Get cli arguments and set environment variables */
const args: Args = getCliArguments([
	'--port',
	'--stage',
	'--pg-username',
	'--pg-password',
])
setEnvs(['port', 'stage', 'pgUsername', 'pgPassword'], args)

/** Assign database connecion as a global variable. Only one connection is allowed per server instance. */
declare global {
	var db: DB
	var sqlEvent: EventEmitter
}

global.db = new DB(
	process.env.STAGE!,
	process.env.PGUSERNAME!,
	process.env.PGPASSWORD!
)
global.sqlEvent = sqlEvent

const app = expressWs(express()).app
expressWs(app)
app.use(cors())
app.use(express.json())

/** Start server */
app.listen(parseFloat(process.env.PORT!), '0.0.0.0', () => {
	console.log(`Server is listening on port ${process.env.PORT}`)
})

/** Broadcast log events in real time to the client */
app.ws('/logs/:short', async (ws, req) => {
	const urlRecord = (
		await db.Url().findOne({ where: { short: req.params.short } })
	)?.toJSON()
	if (urlRecord) {
		sqlEvent.on('log-created', (data) => {
			if (urlRecord.id === data.url_id) {
				ws.send(JSON.stringify(data))
			}
		})
	}
})

/** All other routes must come before the catch all route */
app.use('/', create)
app.use('/r', redirect)

/** Catch all route */
app.use((req: Request, res: Response) => {
	res.status(404).json({ error: '404 - Resource not found' })
})
