import fs from 'fs-extra'
import klaw from 'klaw'
import slugify from 'slugify'
import koder from './koder.mjs'
import prettier from 'prettier'
import pino from 'pino'
import { MeiliSearch } from 'meilisearch'
import dotenv from 'dotenv'
import { remark } from 'remark'
import mdx from 'remark-mdx'
import strip from 'remark-mdx-to-plain-text'
console.log(remark)

dotenv.config()

const logger = pino({
	level: 'debug',
	timestamp: false,
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true
		}
	}
})

const searchClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_SEARCH_HOST,
  apiKey: process.env.SEARCH_KEY_ADMIN
})

// Directory of pages to show on left sidebar (+ search)
const CONTENT_ORDER = [
	'/docs/getting-started',
	'/docs/cli',
	'/docs/managed-entry',
	'/docs/configuration',
	'/docs/advanced-nextjs',
	'/docs/caching',
	'/docs/environment-variables',
	'/docs/i18n',
	'/docs/web-props',
]

const run = async () => {
	logger.info(`Generating metadata...`)
	const readDirectory = process.cwd() + '/pages'
	const metadata = {
		_contentOrder: CONTENT_ORDER
	}

	for await (const file of klaw(readDirectory)) {
		// Skip directories and non .mdx files
		if (file.stats.isDirectory() || !file.path.endsWith('.mdx')) {
			continue;
		}

		// Process page and add to metadata
		const page = await processPage(file)
		metadata[page.path] = page
	}

	// Add next page to previous page metadata
	for (const contentPath of CONTENT_ORDER) {
		const page = metadata[contentPath]
		if (!page) {
			continue;
		}

		// Assign previous page
		const previousPath = CONTENT_ORDER[CONTENT_ORDER.indexOf(contentPath) - 1]
		if (previousPath) {
			const previousPage = metadata[previousPath]
			metadata[contentPath].previous = {
				path: previousPage.path,
				title: previousPage.title
			}
		}

		// Assign next page
		const nextPath = CONTENT_ORDER[CONTENT_ORDER.indexOf(contentPath) + 1]
		if (nextPath) {
			const nextPage = metadata[nextPath]
			metadata[contentPath].next = {
				path: nextPage.path,
				title: nextPage.title
			}
		}
	}

	// Get all existing search documents with only the id field
	const existingSearchDocuments = await searchClient.index('pilotjs-docs').getDocuments({ attributesToRetrieve: ['id'] })
	logger.warn(`Existing search documents: ${JSON.stringify(existingSearchDocuments)}`)

	// Index each page from metadata in MeiliSearch (not including _contentOrder)
	const indexedDocuments = await Promise.all(Object.keys(metadata)
		.filter((key) => key !== '_contentOrder')
		.map(async (key) => {
			const page = metadata[key]
			const pageId = slugify(page.path.replace(/\//g, '-'), { lower: true })
			const pageContent = (await parsePage(page._contents)).replace(`${page.title}\n\n`, '')
			delete page._contents

			return {
				id: pageId,
				content: pageContent,
				path: page.path,
				title: page.title
			}
		})
	)
	logger.info(`Indexing ${indexedDocuments.length} documents...`)
	await searchClient.index('pilotjs-docs').addDocuments(indexedDocuments)

	// Delete any search documents that no longer exist
	const existingSearchDocumentIds = existingSearchDocuments.map((doc) => doc.id)
	const newSearchDocumentIds = indexedDocuments.map((doc) => doc.id)
	const deletedSearchDocumentIds = existingSearchDocumentIds.filter((id) => !newSearchDocumentIds.includes(id))
	if (deletedSearchDocumentIds.length) {
		logger.info(`Deleting ${deletedSearchDocumentIds.length} documents...`)
		await searchClient.index('pilotjs-docs').deleteDocuments(deletedSearchDocumentIds)
	}

	// Write metadata to file
	logger.info(`Writing metadata...`)
	const kode = koder().const('metadata', { export: true }).value(metadata)
	await fs.outputFile(process.cwd() + '/utils/metadata.ts', prettier.format(kode.toString(), {
		parser: 'babel',
		semi: false,
		singleQuote: true,
		trailingComma: 'none',
		useTabs: true
	}))
}

const parsePage = async (content) => {
	const result = await remark()
		.use(mdx)
		.use(strip)
		.process(content)

	return result.value.trim()
}

const processPage = async (file) => {
	const { path } = file
	const contents = await fs.readFile(path, 'utf8')
	logger.info(`Processing ${path}...`);

	// Prepare metadata object
	const metadata = {
		_contents: contents,
		path: path.replace(process.cwd() + '/pages', '').replace('.mdx', '').replace('/index', ''),
		title: contents.match(/^# .*/gm)[0].replace('# ', '')
	}

	// Match headings (starting at h2) and add them to the table of contents array as an object with the heading text and the slug
	// Subheadings should be a nested array inside the parent heading object
	const headings = contents.match(/^(##|###) .*/gm);
	logger.debug(JSON.stringify(headings))
	if (!headings) {
		return metadata;
	}

	// Create table of contents
	const tableOfContents = [];
	let currentHeading = null;
	for (const heading of headings) {
		const headingText = heading.replace('### ', '').replace('## ', '');
		const slug = slugify(headingText, { lower: true })

		// Look for a subheading
		if (heading.startsWith('## ')) {
			currentHeading = { text: headingText, slug, subheadings: [] };
			tableOfContents.push(currentHeading);
		} else {
			currentHeading.subheadings.push({ text: headingText, slug });
		}
	}

	// Add table of contents to metadata
	metadata.tableOfContents = tableOfContents
	return metadata
}

run()
	.then(() => logger.info(`Done!`))
	.catch((err) => logger.error(err))
