/**
 * © 2022 WavePlay <dev@waveplay.com>
 */

export class Kode {
	/**
	 * The code to be evaluated
	 */
	_code = ''

	//
	_indent

	constructor(options) {
		this._indent = options?.indent || 2

		if (options?.comment) {
			this.comment(options.comment, { type: 'block-line' })
		}
	}

	block(kode) {
		this._code += `{\n${kode.toString({
			indent: this._indent
		})}\n}\n`
		return this
	}

	call(name, params, options) {
		const { newline = true, semicolon = true } = options ?? {}
		const callParams = params ? params.map((param) => parseValue(param, { indent: this._indent })).join(', ') : ''
		this._code += `${name}(${callParams})` + (semicolon ? ';' : '') + (newline ? '\n' : '')
		return this
	}

	cases(cases) {
		cases.forEach(({ case: caseValue, body }) => {
			this._code += `case '${caseValue}':\n${body.toString({
				indent: this._indent
			})}\n`
		})
		return this
	}

	comment(text, options) {
		if (options?.type === 'block-line') {
			this._code += `/* ${text} */\n`
		} else {
			this._code += `// ${text}\n`
		}
		return this
	}

	const(name, options) {
		const { end, export: exportConst, return: returnConst } = options || {}
		let newCode = `const ${name}`

		if (end) {
			newCode += ';\n'
		} else {
			newCode += ' = '
		}

		if (exportConst) {
			newCode = `export ${newCode}`
		} else if (returnConst) {
			newCode = `return ${newCode}`
		}

		this._code += `${newCode}`
		return this
	}

	default(kode) {
		this._code += `default:\n${kode.toString({
			indent: this._indent
		})}\n`
		return this
	}

	function(name, options) {
		const { export: exportFunction, params } = options || {}
		let newCode = `function ${name}(${params?.join(', ')}) `

		if (exportFunction) {
			newCode = `export ${newCode}`
		}

		this._code += `${newCode}`
		return this
	}

	import(name, path, options) {
		const { dynamic, export: exportImport, return: returnImport } = options || {}
		let newCode = 'import'

		if (name) {
			newCode += ` ${name}`
		}

		if (dynamic) {
			newCode += `('${path}')`
		} else if (name) {
			newCode += ` from '${path}'`
		} else {
			newCode += ` '${path}'`
		}

		if (exportImport) {
			newCode = `export ${newCode}`
		} else if (returnImport) {
			newCode = `return ${newCode}`
		}

		this._code += `${newCode};\n`
		return this
	}

	newline() {
		this._code += '\n'
		return this
	}

	switch(value) {
		this._code += `switch (${value}) `
		return this
	}

	throw(error) {
		if (typeof error === 'string') {
			this._code += `throw \`${error}\`;\n`
		} else {
			this._code += `throw new Error(\`${error.message}\`);\n`
		}
		return this
	}

	toString(options) {
		const { indent, indentFirst = true } = options || {}
		let str = this._code

		// Add indentation before each line
		if (typeof indent === 'number') {
			str = this._code.replace(/^/gm, ' '.repeat(indent))
		} else if (typeof indent === 'string') {
			str = this._code.replace(/^/gm, indent)
		}

		// Remove indentation from the first line
		if (!indentFirst) {
			str = str.replace(/^(\s+)/, '')
		}

		// Remove indentation only from the last line
		str = str.replace(/\n\s+$/, '')

		return str
	}

	value(value) {
		this._code += parseValue(value, { indent: this._indent }) + ';\n'
		return this
	}
}

function koder(options) {
	// Merge default options with the provided options
	options = {
		// @ts-ignore
		...koder.defaultOptions,
		...(options || {})
	}
	return new Kode(options)
}
koder.config = function (defaultOptions) {
	this.defaultOptions = defaultOptions
}
export default koder

function parseValue(value, options) {
	const { currentSpace = '', indent, indentLast = true } = options || {}
	const spaceIndent = typeof indent === 'number' ? ' '.repeat(indent) : indent
	const space = spaceIndent + currentSpace
	if (value === undefined) {
		return 'undefined'
	} else if (value === null) {
		return 'null'
	} else if (typeof value === 'string') {
		return `'${value}'`
	} else if (value instanceof Kode) {
		return value.toString({ indent: spaceIndent, indentFirst: false })
	} else if (Array.isArray(value)) {
		return `[${value.map((v) => parseValue(v, { currentSpace: space, indent: 0, indentLast: false })).join(', ')}]`
	} else if (typeof value === 'object') {
		if (Object.keys(value).length) {
			let result = '{\n'
			const entries = Object.entries(value)
			entries.forEach(([key, val], index) => {
				result += `${space}'${key}': ${parseValue(val, { currentSpace: space, indent })}${
					index === entries.length - 1 ? '' : ','
				}\n`
			})
			return result + (indentLast ? space.replace(spaceIndent, '') : '') + '}'
		} else {
			return '{}'
		}
	} else {
		return `${value}`
	}
}
