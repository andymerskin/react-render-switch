import { AsyncSwitch } from "react-render-switch";

import { QueryControls } from "./QueryControls";
import { useFakeQuery } from "./useFakeQuery";

export function App() {
  const { query, setState } = useFakeQuery();
  const { isLoading, isError, data } = query;
  const isEmpty = data !== undefined && data.length === 0;

  return (
    <div>
      <QueryControls query={query} onStateChange={setState} />
      <AsyncSwitch
        states={{ isLoading, isError, isEmpty }}
        loading={<p>Loading…</p>}
        error={<p>Error</p>}
        empty={<p>No items</p>}
      >
        <ul>
          {(data ?? []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </AsyncSwitch>
    </div>
  );
}
