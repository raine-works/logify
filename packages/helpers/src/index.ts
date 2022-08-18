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
 * @param req List of additional arguments that are required.
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

/**
 * @param envs Array of environment variables to update.
 * @param args Object of key value pairs to check for required arguments.
 * @return void
 */
export const setEnvs = (envs: Array<string>, args: Args): void => {
	for (const e of envs) {
		process.env[e.toUpperCase()] = args[e] ?? process.env[e.toUpperCase()]
	}
}

/**
 *
 * @param domain fully qualified domain name. example.com
 * @param subDomain sub domain. www
 * @returns complete url. https://example.com or http://localhost
 */
export const getUrl = (domain: string, subDomain?: string, port?: number) => {
	const hostname = process.env.STAGE === 'PROD' ? domain : 'localhost'
	const prtcl = process.env.STAGE === 'PROD' ? 'https://' : 'http://'
	return `${prtcl}${subDomain ? subDomain + '.' : ''}${hostname}${
		port ? ':' + port : ''
	}`
}
