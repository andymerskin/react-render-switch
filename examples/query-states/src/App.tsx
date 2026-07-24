import { createRenderSwitch } from "render-switch";

import { QueryControls } from "./QueryControls";
import { useFakeQuery } from "./useFakeQuery";

export function App() {
  const { query, setState } = useFakeQuery();
  const { isLoading, isError, isReady, data } = query;

  const renderState = createRenderSwitch({
    loading: { test: isLoading, render: () => <p>Loading…</p> },
    error: { test: isError, render: () => <p>Error</p> },
    empty: {
      test: data !== undefined && data.length === 0,
      render: () => <p>No items</p>,
    },
    ready: {
      test: isReady,
      render: () => (
        <ul>
          {data!.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
    },
  });

  return (
    <div>
      <QueryControls query={query} onStateChange={setState} />
      {renderState()}
    </div>
  );
}
