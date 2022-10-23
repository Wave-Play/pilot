
## Advanced setup for NextJS

Simply add **`<PilotArea/>`** as a top-level component. `_app.js` is the perfect place to use it in.

Check out the [NextJS Documentation](https://nextjs.org/docs/advanced-features/custom-app) if you don't already have one set up.

> `/pages/_app.js`
```jsx
import { PilotArea } from '@waveplay/pilot';

const App = ({ Component, pageProps }) => {
  return (
    <PilotArea renderContent={'never'}>
      <Component {...pageProps}/>
    </PilotArea>
  );
};
export default App;
```

Setting this up allows you to use other **PilotJS** features, such as customizing the rendering area for more control, custom NextJS router, custom native routers, placeholders, and so much more!

> `/pages/_app.js`
```jsx
const radixRouter = new RadixRouter();
const router = useRouter();

return (
  <PilotArea
    config={{
      logger: pino({ level: 'debug' }),
      nextRouter: router,
      router: radixRouter
    }}
    renderContent={'never'}
    renderPlaceholder={'never'}>
    <Component {...pageProps}/>
    <PilotRenderer
      persistPlaceholder={true}
      Placeholder={(visible) => <CustomPlaceholder visible={visible}/>}/>
  </PilotArea>
);
```
