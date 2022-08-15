import _ from 'lodash'

export interface Args {
	[keys: string]: string
}

const reqArgs = (expected: Array<string> | '*', rawArgs: Array<string>) => {
	if (expected !== '*') {
		expected.forEach((e, i) => {
			if (e.includes('!') && !rawArgs.includes(e.replace('!', ''))) {
				throw new Error(`${e.replace('!', '')} is a required flag`)
			}
			expected[i] = e.replace('!', '')
		})
	}
	return { rawArgs, expected }
}

/**
 * @param expected Array of strings to specifiy which cli arguments should be allowed ['--port', '--stage']. If left blank will allow all.
 * @returns Object of key value pairs relating to the cli arguements { port: 8080, stage: prod }.
 */
export const getCliArguments = (exp: Array<string> | '*' = '*'): Args => {
	const { rawArgs, expected } = reqArgs(exp, process.argv.splice(2))
	const args: Args = {}

	rawArgs.forEach((e, i) => {
		if (e.charAt(0) === '-') {
			if (expected !== '*' && !expected.includes(e)) {
				throw new Error(`${e} is not an expected flag`)
			} else if (!rawArgs[i + 1] || rawArgs[i + 1].charAt(0) === '-') {
				args[_.camelCase(e)] = 'true'
			} else {
				args[_.camelCase(e)] = rawArgs[i + 1]
			}
		}
	})
	return args
}

/**
 * @param req Array of string to specify which additional arguments are required.
 * @param args Object of key value pairs to check for required arguments.
 * @returns Boolean
 */
export const hasReqArguments = (req: Array<string>, args: Args): boolean => {
	let hasAllKeys = true
	req.forEach((k, i) => {
		req[i] = _.camelCase(k)
	})
	for (const key of req) {
		if (!Object.keys(args).includes(key)) {
			hasAllKeys = false
		}
	}
	return hasAllKeys
}

export const setEnvs = (envs: Array<string>, args: Args) => {
	for (const e of envs) {
		process.env[e.toUpperCase()] = args[e] ?? process.env[e.toUpperCase()]
	}
}
