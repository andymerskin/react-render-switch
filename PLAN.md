# react-render-switch library plan

## Decisions (locked)

| Topic | Choice |
|---|---|
| `test` | `boolean \| ((props: P) => boolean)` |
| No match | Optional `default` case; returns `null` when omitted |
| React | React-only; `react` peer dependency; returns `ReactNode` |
| Case order | Object insertion order (`Record<string, Case>`) |
| Export name | `createRenderSwitch` only |
| Config lifetime | Support both rebuild-each-render and stable factory; document tradeoffs |
| v1 scope | Render-only (no generic `match`/`run` core) |

## API

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

function createRenderSwitch<P = void>(
  cases: Cases<P>
): (props: P) => ReactNode;
```

### Runtime behavior

1. Iterate object keys in insertion order, **skipping `default`**.
2. For each case: evaluate `test` (call if function, else use boolean).
3. On first truthy test: return `render(props)` and stop.
4. If no case matches: return `cases.default?.render(props) ?? null`.

### Config lifetime patterns

- **Rebuild each render** — create inside component body; boolean `test` values stay fresh with hook state.
- **Stable factory** — create once (`useMemo` or module scope); use function `test: () => isLoading` or prop-driven `test: (props) => ...` so values are not stale.

### Usage examples

**Hook-driven state (rebuild each render):**

```tsx
const renderState = createRenderSwitch({
  loading: { test: isLoading, render: () => <Loading /> },
  error: { test: isError, render: () => <Error /> },
  empty: { test: !query.data?.length, render: () => <Empty /> },
  ready: { test: isReady, render: () => <List data={query.data} /> },
});

return <div>{renderState()}</div>;
```

**Render props (stable factory):**

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

## Project structure

- `package.json` — ESM, `react` peer dep, Bun for package management and tests
- `tsconfig.json` — strict mode
- `src/types.ts` — `Case`, `DefaultCase`, `Cases`
- `src/createRenderSwitch.ts` — core loop (`for...of Object.entries`, skip `default`, break on first match)
- `src/index.ts` — re-export `createRenderSwitch` and types
- `tests/createRenderSwitch.test.ts`
- `README.md` — API, examples, config-lifetime guidance, warning against spreading case objects

## TypeScript strategy

- `P` defaults to `void`; when `void`, renderer is callable as `renderState()` with no args.
- Infer `P` from `test`/`render` function signatures where possible; allow explicit `createRenderSwitch<P>(...)` for render-props.
- `default` is optional on `Cases<P>`; when omitted, renderer returns `null` on no match.
- `default` has no `test` — excluded from match loop at type and runtime level.

## Tests

| Case | Assert |
|---|---|
| Order | First matching case wins; later cases not called |
| Boolean test | Truthy boolean triggers correct render |
| Function test | `(props) => boolean` receives props |
| Default fallback | No match with `default` returns `default.render` |
| No default | No match without `default` returns `null` |
| `default` skipped in loop | `default` never evaluated as a match candidate |
| Props typing | Explicit generic flows through `render` |

## Non-goals (v1)

- Exhaustive discriminated-union checking
- Async tests
- Generic non-React `match`/`run` core
- Array/tuple case API

## Success criteria

- `createRenderSwitch` exported with optional `default` case; `null` when omitted
- First-match semantics with object insertion order
- Boolean and function `test` both work
- Props inference or explicit generic for render-props
- README documents both config-lifetime patterns and spread-order caveat
