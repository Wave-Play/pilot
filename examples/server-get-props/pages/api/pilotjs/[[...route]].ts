import { createHandler } from '@waveplay/pilot/dist/api-handler';

console.log(`Then what is it?`);
export default createHandler();

/*export default async function handler(req, res) {
  const { route } = req.query
	const props = await getStaticProps()
  res.end(`Post: /${route.join('/')}`)
}*/
