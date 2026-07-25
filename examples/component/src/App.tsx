import { RenderSwitch } from "react-render-switch";

import { QueryControls } from "./QueryControls";
import { useFakeQuery } from "./useFakeQuery";

export function App() {
  const { query, setState } = useFakeQuery();
  const { isLoading, isError, isReady, data } = query;
  const isEmpty = data !== undefined && data.length === 0;

  return (
    <div>
      <QueryControls query={query} onStateChange={setState} />
      <RenderSwitch
        states={{ isLoading, isError, isEmpty, isReady }}
        loading={<p>Loading…</p>}
        error={<p>Error</p>}
        empty={<p>No items</p>}
        ready={
          <ul>
            {(data ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        }
      />
    </div>
  );
}
