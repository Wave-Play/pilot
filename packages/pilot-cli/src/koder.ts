/**
 * © 2022 WavePlay <dev@waveplay.com>
 */

interface KodeOptions {
	/** Initial comment at the top of the file */
	comment?: string

	/** The number of spaces to indent the code by */
	indent?: number | string
}

interface CasesOptions {
	case: string
	body: Kode
}

interface CommentOptions {
	type?: 'block-line' | 'line'
}

interface ConstOptions {
	end?: boolean
	export?: boolean
	return?: boolean
}

interface FunctionOptions {
	export?: boolean
	params?: string[]
}

interface ImportOptions {
	dynamic?: boolean
	export?: boolean
	return?: boolean
}

interface ToStringOptions {
	indent?: number | string
}

export class Kode {
	/**
	 * The code to be evaluated
	 */
	private _code: string = '';

	//
	private _indent: number | string;

	constructor(options?: KodeOptions) {
		this._indent = options?.indent || 2;

		if (options?.comment) {
			this.comment(options.comment, { type: 'block-line' });
		}
	}

	public block(kode: Kode): Kode {
		this._code += `{\n${kode.toString({
			indent: this._indent
		})}\n}\n`;
		return this;
	}

	public cases(cases: CasesOptions[]): Kode {
		cases.forEach(({ case: caseValue, body }) => {
			this._code += `case '${caseValue}':\n${body.toString({
				indent: this._indent
			})}\n`;
		});
		return this;
	}

	public comment(text: string, options?: CommentOptions): Kode {
		if (options?.type === 'block-line') {
			this._code += `/* ${text} */\n`;
		} else {
			this._code += `// ${text}\n`;
		}
		return this;
	}

	public const(name: string, options?: ConstOptions): Kode {
		const { end, export: exportConst, return: returnConst } = options || {};
		let newCode = `const ${name}`;

		if (end) {
			newCode += ';\n';
		} else {
			newCode += ' = ';
		}

		if (exportConst) {
			newCode = `export ${newCode}`;
		} else if (returnConst) {
			newCode = `return ${newCode}`;
		}

		this._code += `${newCode}`;
		return this;
	}

	public default(kode: Kode): Kode {
		this._code += `default:\n${kode.toString({
			indent: this._indent
		})}\n`;
		return this;
	}

	public function(name: string, options?: FunctionOptions): Kode {
		const { export: exportFunction, params } = options || {};
		let newCode = `function ${name}(${params?.join(', ')}) `;

		if (exportFunction) {
			newCode = `export ${newCode}`;
		}

		this._code += `${newCode}`;
		return this;
	}

	public import(name: string, options?: ImportOptions): Kode {
		const { dynamic, export: exportImport, return: returnImport } = options || {};
		let newCode = 'import';

		if (dynamic) {
			newCode += `('${name}')`;
		} else {
			newCode += ` '${name}'`;
		}

		if (exportImport) {
			newCode = `export ${newCode}`;
		} else if (returnImport) {
			newCode = `return ${newCode}`;
		}

		this._code += `${newCode};\n`;
		return this;
	}

	public newline(): Kode {
		this._code += '\n';
		return this;
	}

	public switch(value: string): Kode {
		this._code += `switch (${value}) `;
		return this;
	}

	public throw(error: string | Error): Kode {
		if (typeof error === 'string') {
			this._code += `throw '${error}';\n`;
		} else {
			this._code += `throw new Error('${error.message}');\n`;
		}
		return this;
	}

	public toString(options?: ToStringOptions): string {
		const { indent } = options || {};
		let str = this._code;
		
		// Add indentation before each line
		if (typeof indent === 'number') {
			str = this._code.replace(/^/gm, ' '.repeat(indent));
		} else if (typeof indent === 'string') {
			str = this._code.replace(/^/gm, indent);
		}

		// Remove indentation only from the last line
		str = str.replace(/\n\s+$/, '');

		return str;
	}

	public value(value?: any): Kode {
		this._code += `${JSON.stringify(value, undefined, this._indent)};\n`;
		return this;
	}
}

function koder(options?: KodeOptions): Kode {
	// Merge default options with the provided options
	options = {
		// @ts-ignore
		...koder.defaultOptions,
		...options || {}
	};
	return new Kode(options);
}
koder.config = function(defaultOptions: KodeOptions) {
	this.defaultOptions = defaultOptions;
};
export default koder;
