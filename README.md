# react-render-switch

Switch-style UI branching for React. Use `createRenderSwitch` for custom cases, or `<RenderSwitch>` for the common loading / error / empty / ready pattern.

## Install

```bash
bun add react-render-switch
```

Requires React 18+ as a peer dependency.

## Usage

### Component

`<RenderSwitch>` covers the async query pattern with boolean `states` and branch content as `ReactNode` props:

```tsx
import { RenderSwitch } from "react-render-switch";

<RenderSwitch
  states={{ isLoading, isError, isEmpty, isReady }}
  loading={<Loading />}
  error={<Error />}
  empty={<Empty />}
  ready={<List data={data ?? []} />}
/>
```

States are evaluated in order: loading → error → empty → ready. `empty` and `states.isEmpty` are paired — provide both or neither.

### Factory

`createRenderSwitch` takes named cases and returns a renderer. Cases are tested in insertion order; the first matching `test` wins.

```tsx
import { useQuery } from "@tanstack/react-query";
import { createRenderSwitch } from "react-render-switch";

function TodoList() {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const renderState = createRenderSwitch({
    loading: { test: isLoading, render: () => <p>Loading…</p> },
    error: { test: isError, render: () => <p>Failed to load todos</p> },
    empty: {
      test: data !== undefined && data.length === 0,
      render: () => <p>No todos yet</p>,
    },
    ready: {
      test: isSuccess,
      render: () => (
        <ul>
          {data!.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      ),
    },
  });

  return renderState();
}
```

Cases aren't limited to query states — add as many as you need. For example, a `searching` branch when the user has typed a query:

```tsx
const renderState = createRenderSwitch({
  loading: { test: isLoading, render: () => <Loading /> },
  searching: {
    test: searchQuery.length > 0,
    render: () => <FilteredList query={searchQuery} items={data} />,
  },
  ready: {
    test: isSuccess,
    render: () => <FullList items={data} />,
  },
});
```

For a stable factory (module scope or `useMemo`), pass props at call time and use function tests so conditions stay fresh:

```tsx
const renderState = createRenderSwitch<ChildProps>({
  loading: {
    test: (props) => props.isLoading,
    render: () => <Loading />,
  },
  ready: {
    test: (props) => props.items.length > 0,
    render: (props) => <List {...props} />,
  },
  default: { render: () => <Empty /> },
});

return <Component>{(props) => renderState(props)}</Component>;
```

## API

### `createRenderSwitch`

```ts
createRenderSwitch<P = void>(cases: Cases<P>): (props: P) => ReactNode
```

```ts
type Case<P> = {
  test: boolean | ((props: P) => boolean);
  render: (props: P) => ReactNode;
};

type DefaultCase<P> = {
  render: (props: P) => ReactNode;
};

type Cases<P> = Record<string, Case<P>> & {
  default?: DefaultCase<P>;
};
```

| Option | Description |
| --- | --- |
| `test` | Boolean or `(props) => boolean`. First truthy case wins. |
| `render` | `(props) => ReactNode` for the matched case. |
| `default` | Optional fallback when no case matches. Without it, returns `null`. |

Notes:

- Cases run in object insertion order (`default` is skipped during matching).
- Boolean `test` values are read when the renderer runs. For a stable config, prefer function tests so closed-over values stay fresh.
- Avoid spreading case objects (`{ ...base, ...overrides }`) — key order may not match your intent.

### `<RenderSwitch>`

```ts
type RenderSwitchStatesWithEmpty = {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isReady: boolean;
};

type RenderSwitchStatesWithoutEmpty = {
  isLoading: boolean;
  isError: boolean;
  isReady: boolean;
  isEmpty?: never;
};

type RenderSwitchProps =
  | {
      states: RenderSwitchStatesWithoutEmpty;
      loading: ReactNode;
      error: ReactNode;
      ready: ReactNode;
      empty?: never;
    }
  | {
      states: RenderSwitchStatesWithEmpty;
      loading: ReactNode;
      error: ReactNode;
      empty: ReactNode;
      ready: ReactNode;
    };
```

| Prop | Description |
| --- | --- |
| `states` | Booleans for the active branch. Order: loading → error → empty → ready. |
| `loading` / `error` / `ready` | Required branch content. |
| `empty` | Optional. Required (with `states.isEmpty`) when showing an empty state. |

Branch props are plain `ReactNode`, so they are created every render. Guard data access in `ready` (e.g. `(data ?? []).map(...)`) rather than assuming that branch only mounts when data exists.

## Develop

```bash
bun install
bun run build
bun test
bun run example:factory
bun run example:component
```

## License

MIT
