# reactstream

React SSR and client-side hydration for Val Town

## Usage

```tsx
/** @jsxImportSource https://esm.sh/react */
import { render, React } from "https://esm.town/v/jxnblk/reactstream/index.tsx";

function App() {
  const [count, setCount] = React.useState(0);
  
  return (
    <html>
      <body>
        <h1>ReactStream</h1>
        <p>React SSR with client-side hydration in Val Town</p>
        <pre>{count}</pre>
        <button onClick={() => setCount(count - 1)}>-</button>
        <button onClick={() => setCount(count + 1)}>+</button>
      </body>
    </html>
  );
}

export default render(App, import.meta.url);
```

<!-- TODO
[Live example](https://www.val.town/v/jxnblk/ReactStreamDemo)
-->

Used in [jxnblk.com](https://www.val.town/x/jxnblk/dotcom)

To render static HTML without hydration, pass `false` as the second argument.

```tsx
export default render(App, false);
```

## Middleware

Custom middleware can be added in an array as the third argument.
Middleware can add data to the `req.data` object or return a response for things like API endpoints.

```tsx
export default render(App, import.meta.url, [
  analytics,
  robots("User-agent: *\nAllow: /"),
  getInitialProps
])
```

### robots.txt

ReactStream has a built-in middleware to handle request to `/robots.txt`

```tsx
import { render, robots } from "https://esm.town/v/jxnblk/ReactStream";
// ...
export default render(App, import.meta.url, [
  robots("User-agent: *\nAllow: /"),
])
```

### Add a backend request handler

```tsx
// example middleware
async function api (req: Request, res: Response, next): Promise<Response> {
  if (req.pathname !== "/api") return next();
  if (req.method === "POST") {
    return Repsonse.json({ message: "Hello POST request" });
  }
  return Response.json({ ok: true });
}

export default render(App, import.meta.url, [ api ]);
```

### Fetch data on the server to set initial props


```tsx 
// example middleware
async function getInitialProps (req: Request, res: Response, next) {
  // fetch data or do async work to pass as props to the component
  req.data = {
    hello: "props",
  };
  return next();
}

export default render(App, import.meta.url, [ getInitialProps ]);
```

## Starter template

```tsx
/** @jsxImportSource https://esm.sh/react */
import { render } from "https://esm.town/v/jxnblk/reactstream/index.tsx";

function App () {
  return (
    <html>
      <head>
        <title>ReactStream</title>
      </head>
      <body>
        hello
      </body>
    </html>
  );
}

export default render(App, import.meta.url, []);
```

React requires matching versions for SSR and hydration.
Import `React` from `https://esm.town/v/jxnblk/reactstream/index.tsx` to ensure your component uses the same version as this library (currently react@18.3.1).

Inspired by <https://www.val.town/v/stevekrouse/react_http> & <https://www.val.town/v/stevekrouse/reactClientDemo>