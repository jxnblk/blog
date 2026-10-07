/** @jsxImportSource https://esm.sh/react@18.3.1 */
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