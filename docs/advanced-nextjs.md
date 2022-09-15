
## Advanced setup for NextJS

Simply add **`<PilotArea/>`** as a top-level component. `_app.js` is the perfect place to use it in.

Check out the [NextJS Documentation](https://nextjs.org/docs/advanced-features/custom-app) if you don't already have one set up.

```tsx
import { PilotArea } from '@waveplay/pilot';

const App = ({ Component, pageProps }) => {
	return (
		<PilotArea>
			<Component {...pageProps}/>
		</PilotArea>
	);
};
export default App;
```

Setting this up allows you to use other Pilot features, such as customizing the rendering area for more control, custom NextJS router, custom Pilot routers, placeholders, and so much more!

```tsx
const radixRouter = new RadixRouter();
const router = useRouter();

return (
	<PilotArea
		nextRouter={router}
		renderContent={false}
		router={radixRouter}>
		<Component {...pageProps}/>
		<PilotAreaRenderer
			persistPlaceholder={true}
			placeholder={(visible) =>
				<CustomPlaceholder visible={visible}/>
			}/>
	</PilotArea>
);
```
