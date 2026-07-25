import type { Query } from "./useFakeQuery";

type QueryControlsProps = {
  query: Query;
  onStateChange: (state: string) => void;
};

export function QueryControls({ query, onStateChange }: QueryControlsProps) {
  return (
    <>
      <div>
        <button type="button" onClick={() => onStateChange("loading")}>
          Loading
        </button>
        <button type="button" onClick={() => onStateChange("error")}>
          Error
        </button>
        <button type="button" onClick={() => onStateChange("empty")}>
          Empty
        </button>
        <button type="button" onClick={() => onStateChange("ready")}>
          Ready
        </button>
      </div>
      <h2>Query state</h2>
      <pre
        style={{
          border: "1px solid black",
          height: "12em",
          margin: "1em 0",
          overflow: "auto",
          padding: "0.5em",
        }}
      >
        <code>{JSON.stringify(query, null, 2)}</code>
      </pre>
      <h2>Rendered state</h2>
    </>
  );
}
