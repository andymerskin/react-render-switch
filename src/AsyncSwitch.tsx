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
  const { states, loading, error, children } = props;
  const empty = "empty" in props ? props.empty : undefined;

  return createRenderSwitch({
    loading: { test: states.isLoading, render: () => loading },
    error: { test: states.isError, render: () => error },
    ...(empty !== undefined && {
      empty: { test: states.isEmpty === true, render: () => empty },
    }),
    default: { render: () => children },
  })();
}
