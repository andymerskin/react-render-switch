

# react-render-switch

Switch-style UI branching for React. Use `createRenderSwitch` for custom cases, or `<AsyncSwitch>` for the common loading / error / empty pattern (ready content via `children`).

## Install

```bash
bun add react-render-switch
```

Requires React 18+ as a peer dependency.

## Examples

Runnable demos live in `examples/`. From the repo root:

**Component** — async loading/error/empty with `<AsyncSwitch>` (ready via `children`).

```bash
bun run example:component
```

**Factory** — the same query flow with `createRenderSwitch` inside a component.

```bash
bun run example:factory
```

**Custom states** — a contacts list with `selected`, `searching`, and `browsing` branches.

```bash
bun run example:custom-states
```



## Usage



### Component

`<AsyncSwitch>` covers the async query pattern with boolean `states` and branch content as `ReactNode` props:

```tsx
import { AsyncSwitch } from "react-render-switch";

<AsyncSwitch
  states={{ isLoading, isError, isEmpty }}
  loading={<Loading />}
  error={<Error />}
  empty={<Empty />}
>
  <List data={data ?? []} />
</AsyncSwitch>
```

States are evaluated in order: loading → error → empty. Renders `children` when async states aren't matching. `empty` state is optional.

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

type Cases<P> = {
  [key: string]: Case<P> | DefaultCase<P> | undefined;
  default?: DefaultCase<P>;
};
```


| Option    | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| `test`    | Boolean or `(props) => boolean`. First truthy case wins.            |
| `render`  | `(props) => ReactNode` for the matched case.                        |
| `default` | Optional fallback when no case matches. Without it, returns `null`. |


Notes:

- Cases run in object insertion order (`default` is skipped during matching).
- Boolean `test` values are read when the renderer runs. For a stable config, prefer function tests so closed-over values stay fresh.
- Avoid spreading case objects (`{ ...base, ...overrides }`) — key order may not match your intent.



### `<AsyncSwitch>`

```ts
type AsyncSwitchStatesWithEmpty = {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
};

type AsyncSwitchStatesWithoutEmpty = {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: never;
};

type AsyncSwitchProps =
  | {
      states: AsyncSwitchStatesWithoutEmpty;
      loading: ReactNode;
      error: ReactNode;
      children: ReactNode;
      empty?: never;
    }
  | {
      states: AsyncSwitchStatesWithEmpty;
      loading: ReactNode;
      error: ReactNode;
      empty: ReactNode;
      children: ReactNode;
    };
```


| Prop                | Description                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| `states`            | Booleans for the active branch. Order: loading → error → empty.         |
| `loading` / `error` | Required branch content.                                                |
| `children`          | Default content when no other state matches.                            |
| `empty`             | Optional. Required (with `states.isEmpty`) when showing an empty state. |


Branch props are plain `ReactNode`, so they are created every render. Guard data access in `children` (e.g. `(data ?? []).map(...)`) rather than assuming that branch only mounts when data exists.

## Develop

```bash
bun install
bun run build
bun test
```



## License

MIT