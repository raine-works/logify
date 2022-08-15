import { Request, Response, NextFunction } from 'express'
import joiBase, { Root, Schema } from 'joi'
import joiDate from '@joi/date'
import { DateTime } from 'luxon'

export type { Schema }

export interface Schemas {
	[key: string]: Schema
}

interface Req extends Request {
	[key: string]: any
}

export const Joi: Root = joiBase.extend(joiDate)

/**
 * Validates http request against a defined schema.
 * @param objName body | query
 * @param schema Defined joi schema that the objName should be validated against.
 * @returns void
 */
export const validate =
	(objName: 'body' | 'query', schema: Schema) =>
	(req: Req, res: Response, next: NextFunction): void => {
		const allowedObjs = ['body', 'query']
		if (!allowedObjs.includes(objName)) {
			throw new Error(`objName must be of type ${allowedObjs.join(', ')}`)
		}

		const validation = schema.validate(req[objName])
		if (validation.error) {
			res.status(400).json({ error: validation.error.message })
		} else {
			req[objName] = validation.value
			next()
		}
	}

/**
 * Converts joi date time value into a unix timestamp in utc.
 * @param format custom format based on moment.js format tokens. Default value MM/DD/YYYY HH:mm:ss - Example: 08/14/2022 17:39:24.
 * @returns Joi Schema
 */
export const dateTime = (format: string = 'MM/DD/YYYY HH:mm:ss'): Schema => {
	return Joi.date()
		.format(format)
		.custom((val: Date) => {
			return DateTime.fromJSDate(val).toUTC().toUnixInteger()
		})
}

/**
 * Converts joi date value into a unix timestamp in utc.
 * @param format custom format based on moment.js format tokens. Default value MM/DD/YYYY - Example: 08/14/2022.
 * @returns Joi Schema
 */
export const date = (format: string = 'MM/DD/YYYY'): Schema => {
	return Joi.date()
		.format(format)
		.custom((val: Date) => {
			return DateTime.fromJSDate(val).toUTC().toUnixInteger()
		})
}
