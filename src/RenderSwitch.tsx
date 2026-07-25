import type { ReactNode } from "react";

import { createRenderSwitch } from "./createRenderSwitch.js";

type RenderSwitchBaseProps = {
  loading: ReactNode;
  error: ReactNode;
  ready: ReactNode;
};

export type RenderSwitchStatesWithEmpty = {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isReady: boolean;
};

export type RenderSwitchStatesWithoutEmpty = {
  isLoading: boolean;
  isError: boolean;
  isReady: boolean;
  isEmpty?: never;
};

export type RenderSwitchProps =
  | (RenderSwitchBaseProps & {
      states: RenderSwitchStatesWithoutEmpty;
      empty?: never;
    })
  | (RenderSwitchBaseProps & {
      states: RenderSwitchStatesWithEmpty;
      empty: ReactNode;
    });

export function RenderSwitch(props: RenderSwitchProps): ReactNode {
  if ("empty" in props && props.empty !== undefined) {
    const { states, loading, error, ready, empty } = props;
    const { isLoading, isError, isEmpty, isReady } = states;

    const renderState = createRenderSwitch({
      loading: { test: isLoading, render: () => loading },
      error: { test: isError, render: () => error },
      empty: { test: isEmpty, render: () => empty },
      ready: { test: isReady, render: () => ready },
    });

    return renderState();
  }

  const { states, loading, error, ready } = props;
  const { isLoading, isError, isReady } = states;

  const renderState = createRenderSwitch({
    loading: { test: isLoading, render: () => loading },
    error: { test: isError, render: () => error },
    ready: { test: isReady, render: () => ready },
  });

  return renderState();
}
