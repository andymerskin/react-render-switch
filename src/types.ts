import type { ReactNode } from "react";

export type Case<P> = {
  test: boolean | ((props: P) => boolean);
  render: (props: P) => ReactNode;
};

export type DefaultCase<P> = {
  render: (props: P) => ReactNode;
};

export type Cases<P> = Record<string, Case<P>> & {
  default?: DefaultCase<P>;
};
