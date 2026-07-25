# react-render-switch

Switch-style UI branching for React components. Define named cases with a `test` and `render`; `createRenderSwitch` evaluates them in object insertion order and returns the first match.

## Install

```bash
bun add react-render-switch
```

Requires React 18+ as a peer dependency.

## Develop

```bash
bun install
bun run build
bun test
```

## API

```ts
import { createRenderSwitch } from "react-render-switch";

type Case<P> = {
  test: boolean | ((props: P) => boolean);
  render: (props: P) => ReactNode;
};

type DefaultCase<P> = {
  render: (props: P) => ReactNode;
};
```

`createRenderSwitch(cases)` returns a renderer function. On each call:

1. Cases are tested in object insertion order (`default` is skipped).
2. The first truthy `test` runs its `render` and stops.
3. If nothing matches: `default.render(props)` when provided, otherwise `null`.

## Usage

### Hook-driven state (rebuild each render)

Create the switch inside your component so boolean `test` values stay in sync with hook state:

```tsx
const renderState = createRenderSwitch({
  loading: { test: isLoading, render: () => <Loading /> },
  error: { test: isError, render: () => <Error /> },
  empty: { test: !query.data?.length, render: () => <Empty /> },
  ready: { test: isReady, render: () => <List data={query.data} /> },
});

return <div>{renderState()}</div>;
```

### Render props (stable factory)

Create once (module scope or `useMemo`) and pass props at call time. Use function `test` values so conditions are evaluated when props change:

```tsx
const renderState = createRenderSwitch<ChildProps>({
  loading: { test: isLoading, render: () => <Loading /> },
  ready: {
    test: (props) => props.items.length > 0,
    render: (props) => <List {...props} />,
  },
  default: { render: () => <Empty /> },
});

return <Component>{(props) => renderState(props)}</Component>;
```

### Optional default

Omit `default` to return `null` when no case matches:

```tsx
const renderState = createRenderSwitch({
  loading: { test: isLoading, render: () => <Loading /> },
  ready: { test: isReady, render: () => <Content /> },
});
```

## Config lifetime

| Pattern | When to use | `test` form |
|---|---|---|
| Rebuild each render | Hook-driven state inside a component | `test: isLoading` (boolean) |
| Stable factory | Static config, props change at call time | `test: (props) => ...` or `test: () => isLoading` |

Boolean tests are evaluated when the renderer runs, not when the config is created. If you create the config once and rely on closed-over variables, use a function test so values stay fresh.

## Case order

Cases are evaluated in object insertion order. Avoid building case objects with spreads that could reorder keys:

```ts
// Avoid — order may not match intent
createRenderSwitch({ ...baseCases, ...overrides });
```

Define cases inline in the order you want them tested.

## License

MIT
