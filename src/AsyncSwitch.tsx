import type { ReactNode } from "react";

import { createRenderSwitch } from "./createRenderSwitch.js";

type AsyncSwitchBaseProps = {
  loading: ReactNode;
  error: ReactNode;
  children: ReactNode;
};

export type AsyncSwitchStatesWithEmpty = {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
};

export type AsyncSwitchStatesWithoutEmpty = {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: never;
};

export type AsyncSwitchProps =
  | (AsyncSwitchBaseProps & {
      states: AsyncSwitchStatesWithoutEmpty;
      empty?: never;
    })
  | (AsyncSwitchBaseProps & {
      states: AsyncSwitchStatesWithEmpty;
      empty: ReactNode;
    });

export function AsyncSwitch(props: AsyncSwitchProps): ReactNode {
  if ("empty" in props && props.empty !== undefined) {
    const { states, loading, error, children, empty } = props;
    const { isLoading, isError, isEmpty } = states;

    const renderState = createRenderSwitch({
      loading: { test: isLoading, render: () => loading },
      error: { test: isError, render: () => error },
      empty: { test: isEmpty, render: () => empty },
      default: { render: () => children },
    });

    return renderState();
  }

  const { states, loading, error, children } = props;
  const { isLoading, isError } = states;

  const renderState = createRenderSwitch({
    loading: { test: isLoading, render: () => loading },
    error: { test: isError, render: () => error },
    default: { render: () => children },
  });

  return renderState();
}
